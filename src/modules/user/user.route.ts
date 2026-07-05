import { Router, Request, Response } from "express";
import { userController } from "./user.controller";
import { upload } from "../../utils/upload.util";

export const userRouter = Router();

userRouter.post("/register", upload.single("profileImage"), userController.register);
userRouter.post("/login", userController.login);
