import { Document } from "mongoose";

export type TourConfig = {
  name: string;
  rating?: Number;
  price: Number;
} & Document;
