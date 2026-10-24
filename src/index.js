import mongoose from "mongoose";
import { DB_Name } from "./constants";
import express from "express"

const app = express()












( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_Name}`)
        app.on("error", (error) => {
            console.log("ERROR EXP: ", error)
            throw error
        }) // A Listener to make sure express is connected or not (besides of db connection)

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()