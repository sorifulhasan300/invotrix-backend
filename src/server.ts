import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

bootstrap();
