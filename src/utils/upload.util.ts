import multer, { FileFilterCallback, Multer } from "multer";
import { Request } from "express";
import cloudinary from "../config/cloudinary.config";

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

export const upload: Multer = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
  const buffer = file.buffer instanceof Buffer ? file.buffer : Buffer.from(file.buffer as ArrayBuffer);
  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "mini-erp", resource_type: "image" }, (err, res) => {
        if (err) reject(err);
        else if (res) resolve(res);
      })
      .end(buffer);
  });

  return result.secure_url;
};
