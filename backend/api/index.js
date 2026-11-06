import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../src/db/index.js";
import { app } from "../src/app.js";

app.get("/", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    data: null,
    message: "YuBu Backend API is running successfully",
    dbConnected: mongoose.connection.readyState === 1,
    success: true,
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    data: null,
    message: "YuBu Backend API is running successfully",
    dbConnected: mongoose.connection.readyState === 1,
    success: true,
  });
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      data: null,
      message: `Database connection failed: ${error.message}`,
      success: false,
    });
  }
});

export default app;
