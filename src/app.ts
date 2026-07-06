import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import router from "./router/router";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", router);

// Testing Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Welcome to Mini ERP API" });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
