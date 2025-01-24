import "dotenv/config";
import app from "./app.js";
import mongoose, { Schema, Document } from "mongoose";

const password = process.env.DB_PASSWORD || "";
const db = process.env.DB_URL?.replace("<db_password>", password) || "";

mongoose.connect(db).then((con) => {
  console.log("DB connection successfull");
});

type TourConfig = {
  name: string;
  rating?: Number;
  price: Number;
} & Document;

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

const testTour: TourConfig = new Tour({
  name: "The Forest Hiker",
  rating: 4.6,
  price: 499,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is running on Port: ${port}`);
});
