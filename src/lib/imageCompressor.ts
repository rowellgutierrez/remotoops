/**
 * Browser-side Image Resizing and Compression Utility
 * Resizes large images (e.g., camera photos, uncompressed PNGs) to maximum dimensions 
 * and compresses them to JPEG/WebP blobs before uploading to Firebase Storage.
 */

export interface CompressionResult {
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
}

export async function compressAndResizeImage(
  file: File,
  maxDimension: number = 800,
  quality: number = 0.82
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate new dimensions respecting maxDimension ratio
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
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      // Smooth image scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Determine format (prefer JPEG for compressed photos, fallback to PNG if transparent)
      const mimeType = file.type === 'image/png' && hasAlphaChannel(ctx, width, height) 
        ? 'image/png' 
        : 'image/jpeg';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image canvas'));
            return;
          }
          const previewUrl = URL.createObjectURL(blob);
          resolve({ blob, previewUrl, width, height });
        },
        mimeType,
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

function hasAlphaChannel(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    const data = ctx.getImageData(0, 0, Math.min(width, 50), Math.min(height, 50)).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) return true;
    }
  } catch {
    // Cross-origin fallback
  }
  return false;
}
