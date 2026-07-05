import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { userRouter } from "./modules/user/user.route";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testing Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Welcome to Mini ERP API" });
});

// Routes
app.use("/api/users", userRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
