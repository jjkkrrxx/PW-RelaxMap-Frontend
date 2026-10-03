import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  const compressedBlob = await imageCompression(file, {
    maxSizeMB: 0.95,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: file.type,
  });

  return new File([compressedBlob], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });
};
