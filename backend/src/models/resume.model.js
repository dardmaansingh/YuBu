import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Resume title is required"],
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        pdfUrl: {
            type: String,
            required: [true, "PDF URL is required"]
        },
        pdfPublicId: {
            type: String,
            required: [true, "PDF public ID is required"]
        },
        localPdfPath: {
            type: String,
            default: ""
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        status: {
            type: String,
            enum: ["pending", "reviewed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

export const Resume = mongoose.model("Resume", resumeSchema);

