import dotenv from "dotenv";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import { EnvConfig } from "../types/env.types";

dotenv.config();

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVars = [
    "NODE_ENV",
    "PORT",
    "MONGO_URI",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Environment variable ${varName} is required but not defined.`,
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT || "5000",
    MONGO_URI: process.env.MONGO_URI as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  };
};

export const envVars = loadEnvVariables();
export default envVars;
