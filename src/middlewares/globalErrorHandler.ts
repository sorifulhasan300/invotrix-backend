import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: err,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
