import connectDB from "../src/db/index.js";
import { app } from "../src/app.js";

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      data: null,
      message: "Database connection failed",
      success: false,
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    data: null,
    message: "YuBu Backend API is running successfully",
    success: true,
  });
});

export default app;
