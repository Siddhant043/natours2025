import mongoose, { Schema } from "mongoose";
import { TourConfig } from "./types.js";
import slugify from "../utils/slugify.js";

const tourSchema: Schema<TourConfig> = new Schema(
  {
    name: {
      type: String,
      required: [true, "A Tour must have a name"],
      unique: true,
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, "A Tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A Tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A Tour must have a difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a image cover"],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: {
      type: [Date],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return Number(this.duration) / 7;
});

tourSchema.pre<TourConfig>("save", function (next) {
  this.slug = slugify(this.name.toLowerCase());
  next();
});

const Tour = mongoose.model<TourConfig>("Tour", tourSchema);

export default Tour;
