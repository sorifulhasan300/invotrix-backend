import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
import { envVars } from "./config/env.config";

dotenv.config();

const port = Number(envVars.PORT);

async function bootstrap() {
  try {
    await mongoose.connect(envVars.MONGO_URI);
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

bootstrap();
