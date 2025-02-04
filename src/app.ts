import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { AppError } from "./types/errors.js";

const app: Application = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log("Hello from middleware. 👋");
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  const error: AppError = new Error(
    `Can't find ${req.originalUrl} on the server!`
  );
  error.status = "fail";
  error.statusCode = 404;
  next(error);
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
