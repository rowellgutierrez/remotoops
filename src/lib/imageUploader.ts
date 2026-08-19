import { storage, ref, uploadBytesResumable, getDownloadURL } from './firebase';
import { compressAndResizeImage } from './imageCompressor';

export interface ImageUploadResult {
  url: string;
  storagePath: string;
}

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit before compression

/**
 * Validates and uploads a profile avatar or cover image to Firebase Storage.
 * Resizes large photos client-side to ensure fast uploads and low bandwidth consumption,
 * then uploads to /users/{userId}/{type}/{timestamp}_{filename}.
 */
export async function uploadUserImage(
  userId: string,
  file: File,
  type: 'avatar' | 'cover',
  onProgress?: (progressPercent: number) => void
): Promise<ImageUploadResult> {
  if (!userId || !userId.trim()) {
    throw new Error("Authentication required: Cannot upload image without a valid user ID.");
  }

  if (!file) {
    throw new Error("No image file selected.");
  }

  // 1. Validate MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    throw new Error(`Unsupported image format (${file.type || 'unknown'}). Please upload a JPG, PNG, WEBP, or GIF image.`);
  }

  // 2. Validate file size
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`File is too large (${sizeMb}MB). Maximum allowed image size is 10MB.`);
  }

  // 3. Compress & resize
  const maxDimension = type === 'avatar' ? 800 : 1920;
  const quality = type === 'avatar' ? 0.85 : 0.82;

  let uploadBlob: Blob = file;
  let contentType = file.type || 'image/jpeg';

  try {
    const compressionRes = await compressAndResizeImage(file, maxDimension, quality);
    uploadBlob = compressionRes.blob;
    contentType = compressionRes.contentType || 'image/jpeg';
  } catch (compressErr) {
    console.warn("Client-side image compression fallback to original file:", compressErr);
    uploadBlob = file;
  }

  // 4. Construct Storage reference
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
  const extension = contentType === 'image/jpeg' ? '.jpg' : (sanitizedName.includes('.') ? '' : '.jpg');
  const storagePath = `users/${userId}/${type}/${Date.now()}_${sanitizedName}${extension}`;
  const storageRef = ref(storage, storagePath);

  console.log(`[imageUploader] Initiating upload:`, {
    userId,
    originalFileName: file.name,
    processedSizeBytes: uploadBlob.size,
    contentType,
    storagePath,
    imageType: type
  });

  const metadata = {
    contentType,
    customMetadata: {
      originalName: file.name,
      uploadedBy: userId,
      imageType: type,
      uploadedAt: new Date().toISOString()
    }
  };

  // 5. Execute Resumable Upload
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, uploadBlob, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 0 && onProgress) {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(Math.min(progress, 99));
        }
      },
      (error) => {
        console.error(`[imageUploader] Firebase Storage upload error (${storagePath}):`, error);
        let userMessage = error.message || "Failed to upload image to Firebase Storage.";
        if (error.code === 'storage/unauthorized') {
          userMessage = "Permission denied. Please ensure you are logged in to upload images.";
        } else if (error.code === 'storage/canceled') {
          userMessage = "Image upload was canceled.";
        } else if (error.code === 'storage/quota-exceeded') {
          userMessage = "Storage quota exceeded. Please contact platform support.";
        } else if (error.code === 'storage/retry-limit-exceeded') {
          userMessage = "Network connection timed out. Please check your internet and try again.";
        }
        reject(new Error(userMessage));
      },
      async () => {
        try {
          if (onProgress) onProgress(100);
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(`[imageUploader] Upload completed successfully:`, {
            storagePath,
            downloadUrlExists: !!downloadUrl,
            downloadUrlPreview: downloadUrl ? downloadUrl.substring(0, 50) + '...' : 'empty'
          });
          resolve({
            url: downloadUrl,
            storagePath
          });
        } catch (urlErr: any) {
          console.error(`[imageUploader] Failed to retrieve download URL (${storagePath}):`, urlErr);
          reject(new Error(urlErr?.message || "Failed to retrieve permanent image download URL."));
        }
      }
    );
  });
}
