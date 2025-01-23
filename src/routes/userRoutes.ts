import express, { Request, Response } from "express";

const userRouter = express.Router();

const getAllUsers = (req: Request, res: Response) => {
  res.status(500).json({
    status: "failed",
    message: "Route is not defined",
  });
};

const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "failed",
    message: "Route is not defined",
  });
};

const getUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "failed",
    message: "Route is not defined",
  });
};

const updateUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "failed",
    message: "Route is not defined",
  });
};

const deleteUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "failed",
    message: "Route is not defined",
  });
};

userRouter.route("/").get(getAllUsers).post(createUser);

userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
