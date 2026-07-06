import { Request, Response } from "express";
import { catchAsync } from "../../lib/catchAsync";
import sendResponse from "../../lib/sendResponse";
import { registerUser, loginUser } from "./auth.service";
import {
  registerSchema,
  loginSchema,
  LoginInput,
  RegisterInput,
} from "../../validations/user.validation";

const register = catchAsync(async (req: Request, res: Response) => {
  console.log(req.file);
  const validated: RegisterInput = registerSchema.parse({
    ...req.body,
    profileImage: req.file,
  });

  const result = await registerUser(validated);
  sendResponse(
    res,
    result.statusCode,
    result.success,
    result.message,
    result.data,
  );
});

const login = catchAsync(async (req: Request, res: Response) => {
  const validated: LoginInput = loginSchema.parse(req.body);
  const result = await loginUser(validated);
  sendResponse(
    res,
    result.statusCode,
    result.success,
    result.message,
    result.data,
  );
});

export const userController = {
  register,
  login,
};
