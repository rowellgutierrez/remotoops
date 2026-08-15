import { storage, ref, uploadBytesResumable, getDownloadURL } from './firebase';

export interface ResumeUploadResult {
  url: string;
  fileName: string;
  storagePath: string;
  sizeBytes: number;
  uploadedAt: string;
}

/**
 * Uploads a candidate's resume (PDF, DOCX, DOC, TXT, RTF) to Firebase Cloud Storage
 * under a secure path: users/{userId}/resumes/{timestamp}_{sanitizedFileName}
 * using resumable upload with real progress tracking and returns the permanent download URL.
 */
export async function uploadResumeFile(
  userId: string,
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<ResumeUploadResult> {
  if (!file) {
    throw new Error('No resume file selected.');
  }

  if (!userId || typeof userId !== 'string') {
    throw new Error('User authentication is required to upload a resume.');
  }

  const allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (!allowedExtensions.includes(ext)) {
    throw new Error('Please upload a valid document format (.pdf, .doc, .docx, .txt, .rtf).');
  }

  // 15MB file size limit
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Resume file size must be less than 15MB.');
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `users/${userId}/resumes/${Date.now()}_${sanitizedName}`;
  const storageRef = ref(storage, storagePath);

  // Set explicit content type
  let contentType = file.type;
  if (!contentType) {
    if (ext === 'pdf') contentType = 'application/pdf';
    else if (ext === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (ext === 'doc') contentType = 'application/msword';
    else if (ext === 'txt') contentType = 'text/plain';
    else if (ext === 'rtf') contentType = 'application/rtf';
    else contentType = 'application/octet-stream';
  }

  const metadata = {
    contentType,
    customMetadata: {
      originalFileName: file.name,
      uploadedBy: userId,
      uploadedAt: new Date().toISOString()
    }
  };

  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  return new Promise<ResumeUploadResult>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 0) {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) {
            onProgress(progress);
          }
        }
      },
      (error) => {
        console.error('Firebase Cloud Storage resume upload error:', error);
        let userMessage = error.message;
        if (error.code === 'storage/unauthorized') {
          userMessage = 'Permission denied: Please sign in to upload your resume.';
        } else if (error.code === 'storage/canceled') {
          userMessage = 'Resume upload was cancelled.';
        } else if (error.code === 'storage/quota-exceeded') {
          userMessage = 'Storage quota reached. Please try a smaller file.';
        } else if (error.code === 'storage/retry-limit-exceeded') {
          userMessage = 'Upload timed out. Please check your network connection and try again.';
        }
        reject(new Error(userMessage));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          if (!downloadUrl) {
            throw new Error('Failed to retrieve resume download URL from Firebase.');
          }

          resolve({
            url: downloadUrl,
            fileName: file.name,
            storagePath: storagePath,
            sizeBytes: file.size,
            uploadedAt: new Date().toISOString()
          });
        } catch (downloadErr: any) {
          console.error('Failed to obtain download URL for resume:', downloadErr);
          reject(new Error(downloadErr.message || 'Failed to generate permanent resume link.'));
        }
      }
    );
  });
}
