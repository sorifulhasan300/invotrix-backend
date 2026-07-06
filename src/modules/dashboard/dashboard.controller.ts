import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../lib/sendResponse";
import { getDashboardStatsFromDB } from "./dashboard.service";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getDashboardStatsFromDB();

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Dashboard stats fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
