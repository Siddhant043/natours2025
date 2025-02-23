import { Document } from "mongoose";

export type TourConfig = {
  name: string;
  slug?: string;
  duration: Number;
  maxGroupSize: Number;
  difficulty: String;
  ratingsAverage?: Number;
  ratingsQuantity?: Number;
  price: Number;
  priceDiscount?: Number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: [string];
  createdAt: Date;
  startDates: [Date];
  secretTour?: Boolean;
} & Document;

export type UserConfig = {
  _id: string,
  name: string
  email: string
  photo?: string
  password: string
  passwordConfirm: string | undefined
  checkPasswords: Function
} & Document