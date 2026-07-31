import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

// Use memory storage to parse the multipart form into memory first.
// Then upload the buffer to Cloudinary explicitly. This keeps routes and
// controllers unchanged (they still call upload.single(field)) while
// avoiding reliance on the `multer-storage-cloudinary` package which
// can behave inconsistently across multer/cloudinary SDK versions.
const memoryStorage = multer.memoryStorage();

const fileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type.'));
  }
};

const multerInstance = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

async function uploadBufferToCloudinary(req: any, res: any, next: any) {
  if (!req.file || !req.file.buffer) return next();

  try {
    // Determine resource_type from mimetype for better routing (image/video/raw)
    const mimetype: string = req.file.mimetype || '';
    let resource_type = 'auto';
    if (mimetype.startsWith('image/')) resource_type = 'image';
    else if (mimetype.startsWith('video/')) resource_type = 'video';
    else if (mimetype === 'application/pdf') resource_type = 'raw';

    const uploadOptions: any = {
      folder: 'LearnStack',
      resource_type,
      // allowed_formats is optional for signed server-side uploads; keep minimal
      // to avoid accidental rejection by the API.
      // allowed_formats: ['jpg','png','jpeg','webp','pdf','mp4','mov']
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (err: any, result: any) => {
      if (err) return next(err);
      // Normalize fields expected by the rest of the app
      req.file.path = result.secure_url;
      req.file.size = result.bytes;
      req.file.filename = result.public_id;
      req.file.originalname = req.file.originalname || result.original_filename;
      return next();
    });

    // Convert buffer into a readable stream and pipe to Cloudinary
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  } catch (err) {
    next(err);
  }
}

// Export an object with single() that matches multer API usage in routes
// so existing routes calling upload.single('thumbnail') keep working.
export const upload = {
  single: (field: string) => (req: any, res: any, next: any) => {
    const multerSingle = multerInstance.single(field);
    multerSingle(req, res, (err: any) => {
      if (err) return next(err);
      uploadBufferToCloudinary(req, res, next);
    });
  },
};
