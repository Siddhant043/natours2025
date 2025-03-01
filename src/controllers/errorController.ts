import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.js";
import { ErrorItem } from "../types/errors.js";

const handleCastErrorDB = (err: AppError) => {
  const message = `Invalid ${err.path} for ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err: AppError) => {
  const value = err.errorResponse.errmsg?.match(/"(.*?)"/)[0]
  const message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message, 500)
}

const handleValidationErrorDB = (err: AppError) => {
  const errors = Object.values(err.errors as Record<string, ErrorItem>).map((item) => item.message);
  const message = `Invalid input data. ${errors.join(". ")}`
  return new AppError(message, 400)
}

const handleJWTError = () => new AppError("Invalid token! Please login again.", 401)

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsErrorDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") error = handleJWTError();

    sendErrorProd(error, res);
  }
};
export default globalErrorHandler;
