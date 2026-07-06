import { Router, Request, Response } from "express";
import { userController } from "./auth.controller";
import { upload } from "../../utils/upload.util";
import { validate } from "../../middlewares/validation";
import { registerSchema, loginSchema } from "../../validations/user.validation";

export const authRouter = Router();

authRouter.post(
  "/register",
  upload.single("profileImage"),
  validate(registerSchema, "body"),
  userController.register,
);
authRouter.post(
  "/login",
  validate(loginSchema, "body"),
  userController.login,
);
