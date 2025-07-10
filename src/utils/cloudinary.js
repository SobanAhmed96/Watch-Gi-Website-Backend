import {v2 as cloudinary } from "cloudinary";
import {promises as fs} from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadCloudinary = async (filepath) => {
  try {
    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "image",
    });

    // Remove file after upload
    await fs.unlink(filepath);

    // ✅ RETURN the Cloudinary upload response
    return response;
  } catch (error) {
    try {
      // Safely delete file if exists
      await fs.unlink(filepath);
    } catch (e) {}

    console.error("Cloudinary upload failed:", error?.message || error);
    return null;
  }
};



export default uploadCloudinary;