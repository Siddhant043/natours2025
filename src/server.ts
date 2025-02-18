import "dotenv/config";
import app from "./app.js";
import mongoose, { Error } from "mongoose";

process.on('uncaughtException', (err: Error) => {
  console.log(err.name, err.message)
  process.exit(1)
})

const password = process.env.DB_PASSWORD || "";
const db = process.env.DB_URL?.replace("<db_password>", password) || "";

mongoose.connect(db).then((con) => {
  console.log("DB connection successful");
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App is running on Port: ${port}`);
});


process.on('unhandledRejection', (err: Error) => {
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})


