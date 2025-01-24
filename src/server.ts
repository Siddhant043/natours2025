import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";

const password = process.env.DB_PASSWORD || "";
const db = process.env.DB_URL?.replace("<db_password>", password) || "";

mongoose.connect(db).then((con) => {
  console.log("DB connection successfull");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is running on Port: ${port}`);
});
