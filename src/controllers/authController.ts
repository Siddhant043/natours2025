import { NextFunction, Request, Response } from "express";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { DecodedConfig } from "../types/auth.js";
import { CustomRequest } from "./types.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";
import { UserConfig } from "../models/types.js";
// import { promisify } from 'util'

const jwtSecret =
  process.env.JWT_SECRET ||
  "secret-should-be-at-least-thirty-two-characters-long";
const signToken = (id: string) => {
  const token = jwt.sign({ id }, jwtSecret, { expiresIn: "90d" });
  return token;
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    const correct = user
      ? await user.checkPasswords(password, user.password)
      : false;

    if (!user || !correct) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
    });
  }
);

export const protect = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1. Checking the existence of the token in req
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization?.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError("You are not logged in. Please login to get access", 401)
      );
    }

    // 2. Verification of the token
    const decoded: DecodedConfig = await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, (err: any, decodedToken: any) => {
        if (err) reject(err);
        else resolve(decodedToken);
      });
    });

    // 3. Check if user still exists
    const currentUser = decoded && (await User.findById(decoded.id));
    if (!currentUser) {
      return next(new AppError("User does not exist", 404));
    }

    // 4. Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError("User recently updated password. Please login again.", 401)
      );
    }

    req.user = currentUser;
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as CustomRequest;

    if (!customReq.user || !roles.includes(customReq.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError("There is no user with email address", 404));
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit your patch request with your new password and confirmPassword to:${resetUrl}\n If you didn't forget your password then ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10mins)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token send to email",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Try again later",
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // If token is not expired and the user is present, set the new password
    if (!user) {
      return next(new AppError("Token in invalid or has expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    // Update changedPasswordAt property for the user

    // Log the user in, send JWT

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
    });
  }
);

export const updatePassword = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1. Get user form collection

    const { oldPassword, newPassword, passwordConfirm } = req.body;
    const user: UserConfig = await User.findById(req.user._id).select(
      "+password"
    );

    if (!oldPassword || !newPassword || !passwordConfirm) {
      return next(new AppError("Old password is required", 400));
    }

    // 2. Check if posted password is correct
    const isPasswordCorrect = await user.checkPasswords(
      oldPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(new AppError("Old password is incorrect.", 403));
    }

    // 3. If so, then update
    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;

    await user.save();

    // 4. Log in user, send JWT

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      message: "Password update successfully",
      token,
    });
  }
);
