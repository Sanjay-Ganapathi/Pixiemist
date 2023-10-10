import axios from "axios";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (imageURL: string) => {
  const output = await cloudinary.uploader.upload(
    imageURL,
    { folder: "Images", resource_type: "image" },

    (error, result) => {
      if (error) {
        console.log("[CLOUDINARY_UPLOAD_IMG_ERROR]");
        console.log(error);
      } else {
        console.log("[CLOUDINARY_UPLOAD_IMG_SUCCESS]");
      }
    },
  );

  return output;
};

const uploadMultipleImages = async (imageURLs: string[]) => {
  const output = imageURLs.map((imageURL) => uploadImage(imageURL));

  try {
    const results = await Promise.all(output);
    console.log("[CLOUDINARY_UPLOAD_MULTIPLE_IMAGES_SUCCESS]");

    const final = results.map((result) => result.secure_url);

    return final;
  } catch (err) {
    console.log("[CLOUDINARY_UPLOAD_MULTIPLE_IMAGES_ERROR]");
    console.log(err);
    return [];
  }
};

export { uploadImage, uploadMultipleImages };
