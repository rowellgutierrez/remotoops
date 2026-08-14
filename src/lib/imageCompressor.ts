/**
 * Fast Browser-side Image Resizing and Compression Utility
 * Resizes large images (camera photos, uncompressed screenshots, large PNGs/JPEGs)
 * into lightweight, high-quality JPEG blobs (< 50KB-120KB) before uploading to Firebase Storage.
 *
 * Includes timeout protection and multiple fallbacks (createImageBitmap, Image element, FileReader)
 * to ensure promises always resolve or reject cleanly without hanging.
 */

export interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  sizeBytes: number;
  contentType: string;
}

export async function compressAndResizeImage(
  file: File,
  maxDimension: number = 600,
  quality: number = 0.82
): Promise<CompressionResult> {
  // Wrap with strict 8-second timeout so it cannot hang the UI indefinitely
  return Promise.race([
    doCompress(file, maxDimension, quality),
    new Promise<CompressionResult>((_, reject) =>
      setTimeout(() => reject(new Error('Image processing timed out')), 8000)
    )
  ]);
}

async function doCompress(
  file: File,
  maxDimension: number,
  quality: number
): Promise<CompressionResult> {
  // Strategy 1: Fast-path using standard Image decoding with FileReader base64/dataURL
  // This is the most universally compatible across all browsers (Chrome, Safari, Firefox, iOS, Android Webview)
  // and avoids issues with createImageBitmap color space or revoked objectUrls.
  try {
    const dataUrl = await readFileAsDataURL(file);
    return await renderImageToBlob(dataUrl, maxDimension, quality);
  } catch (err) {
    console.warn("Primary image compression path failed, trying fallback:", err);
  }

  // Strategy 2: Standard ObjectURL fallback
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d', { alpha: false });

        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }
            resolve({
              blob,
              width: canvas.width,
              height: canvas.height,
              sizeBytes: blob.size,
              contentType: 'image/jpeg'
            });
          },
          'image/jpeg',
          quality
        );
      } catch (e) {
        URL.revokeObjectURL(objectUrl);
        reject(e);
      }
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image for compression: ${e}`));
    };

    img.src = objectUrl;
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('FileReader did not return a string'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });
}

function renderImageToBlob(
  dataUrl: string,
  maxDimension: number,
  quality: number
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let { naturalWidth: width, naturalHeight: height } = img;
        if (!width || !height) {
          width = img.width || 300;
          height = img.height || 300;
        }

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(width));
        canvas.height = Math.max(1, Math.round(height));
        const ctx = canvas.getContext('2d', { alpha: false });

        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to generate image blob'));
              return;
            }
            resolve({
              blob,
              width: canvas.width,
              height: canvas.height,
              sizeBytes: blob.size,
              contentType: 'image/jpeg'
            });
          },
          'image/jpeg',
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image in renderImageToBlob'));
    img.src = dataUrl;
  });
}
