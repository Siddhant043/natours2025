import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import { CustomRequest } from "./types.js";

const filterObj = (obj: Record<string, any>, ...allowedFields: string[]) => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

export const updateMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Create error if user updates PASSWORD data
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError("This route is not for password update", 400));
    }

    // 3) Filtered unwanted fieldNames that are not allowed to be updated
    const filterData = filterObj(req.body, "name", "email");

    // 2) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = catchAsync(
  async (req: CustomRequest, res: Response, next: Function) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

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
