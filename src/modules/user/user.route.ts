import { Router, Request, Response } from "express";
import { userController } from "./user.controller";

export const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
