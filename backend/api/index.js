import "dotenv/config";
import mongoose from "mongoose";
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

export default app;
