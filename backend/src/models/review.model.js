import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        resume: {
            type: Schema.Types.ObjectId,
            ref: "Resume",
            required: true,
            index: true
        },
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        feedback: [
            {
                section: {
                    type: String,
                    required: true,
                    trim: true
                },
                comment: {
                    type: String,
                    required: true,
                    trim: true
                }
            }
        ],
        overallComment: {
            type: String,
            required: [true, "Overall review comment is required"],
            trim: true
        },
        score: {
            type: Number,
            required: [true, "Rating score is required"],
            min: [1, "Score must be at least 1"],
            max: [5, "Score cannot exceed 5"]
        }
    },
    {
        timestamps: true
    }
);

reviewSchema.index({ resume: 1, reviewer: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
