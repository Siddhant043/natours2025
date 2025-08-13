import "dotenv/config";
import app from "./app.js";
import mongoose, { Error } from "mongoose";

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err.name, err.message);
  process.exit(1);
});

// Build MongoDB connection string from environment variables
const mongoURL = process.env.MONGO_URL || "";
const mongoUser = process.env.MONGO_USER || "";
const mongoPass = process.env.MONGO_PASSWORD || "";
const mongoDB = process.env.MONGO_DB || "natours";

// Modern Mongoose connection (remove deprecated options)
const mongoOptions = {
  user: mongoUser || undefined, // Use undefined instead of empty string
  pass: mongoPass || undefined,
  dbName: mongoDB,
};

// Connect to MongoDB
mongoose
  .connect(mongoURL, mongoOptions)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err: Error) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Start server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
