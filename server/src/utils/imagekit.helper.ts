import imagekit from '../config/imagekit';

export const uploadBufferToImageKit = async (
  buffer: Buffer,
  fileName: string,
  folder: string
): Promise<string> => {
  try {
    const result = await imagekit.upload({
      file: buffer,
      fileName,
      folder,
    });

    return result.url;
  } catch (error) {
    console.log('========== IMAGEKIT UPLOAD ERROR ==========');
    console.dir(error, { depth: null });
    throw error;
  }
};