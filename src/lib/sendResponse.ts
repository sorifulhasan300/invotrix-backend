import { Response } from "express";
import { IGenericResponse } from "../types/data.interface";

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  meta?: IGenericResponse<T>["meta"],
) => {
  const response: IGenericResponse<T> = {
    success,
    message,
    ...(data && { data }),
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(response);
};

export default sendResponse;
