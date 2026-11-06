import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://yu-bu-g8nd.vercel.app",
    ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()) : [])
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());

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

import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import reviewRouter from "./routes/review.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        statusCode,
        data: null,
        message,
        success: false,
        errors: err.errors || []
    });
});

export { app };
