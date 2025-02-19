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
  summary: String;
  description?: String;
  imageCover: String;
  images?: [String];
  createdAt: Date;
  startDates: [Date];
  secretTour?: Boolean;
} & Document;

export type UserConfig = {
  name: String
  email: String
  photo?: String
  password: String
  passwordConfirm: String
}