import { storage, ref, uploadBytes, getDownloadURL } from './firebase';

export interface ResumeUploadResult {
  url: string;
  fileName: string;
  sizeBytes: number;
}

/**
 * Uploads a candidate's resume (PDF, DOCX, DOC, TXT) to Firebase Storage
 * under a secure path: users/{userId}/resumes/{timestamp}_{sanitizedFileName}
 * and returns the permanent Firebase Storage download URL.
 */
export async function uploadResumeFile(
  userId: string,
  file: File
): Promise<ResumeUploadResult> {
  const allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (!allowedExtensions.includes(ext)) {
    throw new Error('Please upload a valid document file (.pdf, .doc, .docx, .txt).');
  }

  // 15MB file size limit
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Resume file size must be less than 15MB.');
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `users/${userId}/resumes/${Date.now()}_${sanitizedName}`;
  const storageRef = ref(storage, storagePath);

  const contentType = file.type || (ext === 'pdf' ? 'application/pdf' : 'application/octet-stream');

  const uploadPromise = uploadBytes(storageRef, file, {
    contentType,
    cacheControl: 'public, max-age=31536000'
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Resume upload timed out. Please check your connection and try again.')), 20000)
  );

  await Promise.race([uploadPromise, timeoutPromise]);
  const downloadUrl = await getDownloadURL(storageRef);

  if (!downloadUrl || downloadUrl.startsWith('blob:') || downloadUrl.startsWith('data:')) {
    throw new Error('Invalid download URL returned by storage service.');
  }

  return {
    url: downloadUrl,
    fileName: file.name,
    sizeBytes: file.size
  };
}
