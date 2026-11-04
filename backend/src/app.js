import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));


app.use(cookieParser());


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
