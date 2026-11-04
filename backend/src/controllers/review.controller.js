import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Resume } from "../models/resume.model.js";
import { User } from "../models/user.js";

const createReview = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const { feedback, overallComment, score } = req.body;

    if (!overallComment?.trim()) {
        throw new ApiError(400, "Overall comment is required");
    }

    const numericScore = Number(score);
    if (!numericScore || numericScore < 1 || numericScore > 5) {
        throw new ApiError(400, "Score must be a number between 1 and 5");
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    if (resume.owner.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot review your own resume");
    }

    const existingReview = await Review.findOne({
        resume: resumeId,
        reviewer: req.user._id
    });
    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this resume");
    }

    let parsedFeedback = [];
    if (Array.isArray(feedback)) {
        parsedFeedback = feedback
            .filter((item) => item?.section?.trim() && item?.comment?.trim())
            .map((item) => ({
                section: item.section.trim(),
                comment: item.comment.trim()
            }));
    }

    const review = await Review.create({
        resume: resumeId,
        reviewer: req.user._id,
        feedback: parsedFeedback,
        overallComment: overallComment.trim(),
        score: numericScore
    });

    resume.status = "reviewed";
    await resume.save({ validateBeforeSave: false });

    await User.findByIdAndUpdate(req.user._id, {
        $inc: { reputation: 1 }
    });

    const populatedReview = await Review.findById(review._id).populate(
        "reviewer",
        "fullName username avatar reputation"
    );

    return res
        .status(201)
        .json(new ApiResponse(201, populatedReview, "Review submitted successfully"));
});

const getResumeReviews = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;

    const reviews = await Review.find({ resume: resumeId })
        .populate("reviewer", "fullName username avatar reputation")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export {
    createReview,
    getResumeReviews
};
