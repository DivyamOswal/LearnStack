import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

const config = cloudinary.config();

console.log("Cloud Name:", config.cloud_name);
console.log("API Key:", config.api_key);
console.log("API Secret Loaded:", !!config.api_secret);

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", cloudinary.config());

export default cloudinary;