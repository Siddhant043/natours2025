import mongoose, { Schema } from "mongoose";
import { TourConfig } from "./types.js";

const tourSchema: Schema<TourConfig> = new Schema({
  name: {
    type: String,
    required: [true, "A Tour must have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});

const Tour = mongoose.model<TourConfig>("Tour", tourSchema);

export default Tour;
