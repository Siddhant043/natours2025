import mongoose, { Schema } from "mongoose";
import { TourConfig } from "./types.js";
import slugify from "../utils/slugify.js";
import validator from "validator";

const tourSchema: Schema<TourConfig> = new Schema(
  {
    name: {
      type: String,
      required: [true, "A Tour must have a name"],
      unique: true,
      minlength: [10, "A Tour name must have more that equal to 10 characters"],
      maxlength: [40, "A Tour name must have less that equal to 40 characters"],
      // validate: [validator.isAlpha, "Tour name must only contains characters"],
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
      emun: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium or hard",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be below 5"],
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
      validate: {
        validator: function (val) {
          //this is only accessible in current doc on new doc creation, not on update
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below the regular price",
      },
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

// Virtual Properties
tourSchema.virtual("durationWeeks").get(function () {
  return Number(this.duration) / 7;
});

// Document middleware (only runs for save and create and not for update)
tourSchema.pre<TourConfig>("save", function (next) {
  this.slug = slugify(this.name.toLowerCase());
  next();
});

// Query middleware
tourSchema.pre<TourConfig>(/^find/, function (next) {
  this.secretTour = true;
  next;
});

// Aggregation Middleware
tourSchema.pre(
  "aggregate",
  function (this: mongoose.Aggregate<any>, next: Function) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
  }
);

const Tour = mongoose.model<TourConfig>("Tour", tourSchema);

export default Tour;
