import { Request, Response } from "express";

export interface NotFoundData {
  requestedMethod: string;
  requestedUrl: string;
}

export interface NotFoundResponse {
  success: boolean;
  message: string;
  data?: NotFoundData;
}

export const notFound = (req: Request, res: Response<NotFoundResponse>) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    data: {
      requestedMethod: req.method,
      requestedUrl: req.originalUrl,
    },
  });
};
