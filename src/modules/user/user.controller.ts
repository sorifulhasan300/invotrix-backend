import { Request, Response } from "express";
import { catchAsync } from "../../lib/catchAsync";
import sendResponse from "../../lib/sendResponse";
import { StatusCodes } from "http-status-codes";

const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  //   const user = await User.create({ email, password, name });

  //   sendResponse(
  //     res,
  //     StatusCodes.CREATED,
  //     true,
  //     "User registered successfully",
  //     user,
  //   );
});

const login = async (req: Request, res: Response) => {};

export const userController = {
  register,
  login,
};
