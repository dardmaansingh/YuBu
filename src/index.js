import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

const app = express()




connectDB().then(() => {
    app.on("error", (error) => {
        console.log("Error Exp: ", error)
        throw error
    }) //A Listener to make sure express is connected or not (besides of db connection)

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);

    })
}).catch((err) => {
    console.log("Mongodb Connection FAILED: ", err);
})