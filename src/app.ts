import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";

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
  res.status(404).json({
    status: "failed",
    message: `Can't find ${req.originalUrl} on the server!`,
  });
});

export default app;
