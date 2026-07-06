import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import sendResponse from "../../lib/sendResponse";
import { createSaleInDB } from "./sales.service";
import { CreateSaleInput } from "../../types/sels/sales.interface";

export const createSale = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: CreateSaleInput = req.body;

    const result = await createSaleInDB(payload, (req as any).user.id);

    sendResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Sale created successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const salesController = {
  createSale,
};
