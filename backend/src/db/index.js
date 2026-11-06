import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    const rawUri = process.env.MONGODB_URI;
    if (!rawUri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    if (!cached.promise) {
        let uri = rawUri.trim();
        if (!uri.includes(DB_Name)) {
            if (uri.includes("?")) {
                const [base, query] = uri.split("?");
                uri = `${base.replace(/\/$/, "")}/${DB_Name}?${query}`;
            } else {
                uri = `${uri.replace(/\/$/, "")}/${DB_Name}`;
            }
        }

        cached.promise = mongoose.connect(uri).then((mongooseInstance) => {
            console.log(`MongoDB Connected !! DB HOST: ${mongooseInstance.connection.host}`);
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error("MongoDB Connection Failed:", error.message);
        throw error;
    }

    return cached.conn;
};

export default connectDB;
