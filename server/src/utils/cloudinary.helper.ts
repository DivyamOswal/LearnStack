import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "video" | "raw" | "auto" = "auto"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
    console.log("========== CLOUDINARY ==========");
    console.dir(error, { depth: null });
    console.dir(result, { depth: null });

    if (error || !result) {
        return reject(error);
    }

    resolve(result.secure_url);
}
    );

    const readable = new Readable();

    readable.push(buffer);
    readable.push(null);

    readable.pipe(stream);
  });
};