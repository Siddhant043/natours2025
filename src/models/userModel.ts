import { model, Schema } from "mongoose";
import { UserConfig } from "./types.js";
import pkg from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextFunction } from "express";

const { isEmail } = pkg;

const userSchema: Schema<UserConfig> = new Schema({
  name: {
    type: String,
    required: [true, "Name is a required field"],
  },
  email: {
    type: String,
    required: [true, "Email is a required field"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is a required field"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirm Password is a required field"],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre<UserConfig>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 12);

    // Set passwordConfirm to undefined
    this.passwordConfirm = undefined;

    next();
  } catch (err) {
    next(err as Error); // Pass the error to the next middleware
  }
});

userSchema.pre<UserConfig>("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.checkPasswords = async function (
  candidatePassword: string,
  actualPassword: string
) {
  return await bcrypt.compare(candidatePassword, actualPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changeTimeInMili = parseInt(this.passwordChangedAt.getTime()) / 1000; // converting time to mili seconds
    return changeTimeInMili > JWTTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.pre<UserConfig>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = model<UserConfig>("User", userSchema);

export default User;
