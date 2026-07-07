import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./router/router";
import { setupSwagger } from "./config/swagger";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation
setupSwagger(app);

// Routes
app.use("/api/v1", router);

// Testing Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Welcome to Mini ERP API" });
});

// 404 Not Found Handler
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
