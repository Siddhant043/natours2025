class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  path?: string;
  value?: any;
  code?: number;
  errorResponse?: any;
  errors?: any;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Capture stack trace (Node.js only)
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;