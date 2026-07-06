import { Router, Request, Response } from "express";
import { userController } from "./auth.controller";
import { upload } from "../../utils/upload.util";

export const authRouter = Router();

authRouter.post(
  "/register",
  upload.single("profileImage"),
  userController.register,
);
authRouter.post("/login", userController.login);
