import { Request, Response } from "express";

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

export { getAllUsers, getUser, createUser, updateUser, deleteUser };
