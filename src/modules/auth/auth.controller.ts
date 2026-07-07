import { Request, Response } from "express";
import { catchAsync } from "../../lib/catchAsync";
import sendResponse from "../../lib/sendResponse";
import { getUserById, registerUser, loginUser } from "./auth.service";
import {
  registerSchema,
  loginSchema,
  LoginInput,
  RegisterInput,
} from "../../validations/user.validation";
import { Role } from "../../types/user.types";

const register = catchAsync(async (req: Request, res: Response) => {
  const validated: RegisterInput = registerSchema.parse({
    ...req.body,
    profileImage: (req as any).file,
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

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user as { id: string };
  const result = await getUserById(user.id);
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
  getMe,
};
