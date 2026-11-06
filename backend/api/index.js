import connectDB from "../src/db/index.js";
import { app } from "../src/app.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      data: null,
      message: "Database connection failed",
      success: false,
    });
  }
  return app(req, res);
}

