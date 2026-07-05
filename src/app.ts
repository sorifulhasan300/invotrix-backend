import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testing Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Welcome to Mini ERP API" });
});

// Global Error Handler Middleware (Bonus Target)

export default app;
