import cloudinary from '../config/cloudinary';

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'raw' = 'raw'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error('Cloudinary upload failed with no result.'));
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};