import { Appenv } from "./read-env";
import { v2 as cloudinary } from "cloudinary";
// const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: Appenv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
