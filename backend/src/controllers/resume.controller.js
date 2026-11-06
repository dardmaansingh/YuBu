import fs from "fs";
import path from "path";
import os from "os";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resume } from "../models/resume.model.js";
import { Review } from "../models/review.model.js";
import { uploadCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const uploadResume = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title?.trim()) {
        throw new ApiError(400, "Title is required");
    }

    const localFilePath = req.file?.path;
    if (!localFilePath) {
        throw new ApiError(400, "PDF file is required");
    }

    const resumeDir = path.join(os.tmpdir(), "resumes");
    if (!fs.existsSync(resumeDir)) {
        fs.mkdirSync(resumeDir, { recursive: true });
    }
    const cleanFileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const persistentPath = path.join(resumeDir, cleanFileName);
    fs.copyFileSync(localFilePath, persistentPath);

    const uploadedFile = await uploadCloudinary(localFilePath);
    if (!uploadedFile || !uploadedFile.url) {
        if (fs.existsSync(persistentPath)) {
            fs.unlinkSync(persistentPath);
        }
        throw new ApiError(500, "Error while uploading resume PDF to cloud storage");
    }

    const resume = await Resume.create({
        title: title.trim(),
        description: description?.trim() || "",
        pdfUrl: uploadedFile.secure_url || uploadedFile.url,
        pdfPublicId: uploadedFile.public_id,
        localPdfPath: persistentPath,
        owner: req.user._id,
        status: "pending"
    });

    return res
        .status(201)
        .json(new ApiResponse(201, resume, "Resume uploaded successfully"));
});

const getResumeFile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const resume = await Resume.findById(id);
    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    if (resume.localPdfPath && fs.existsSync(resume.localPdfPath)) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${resume.title || 'resume'}.pdf"`);
        return res.sendFile(path.resolve(resume.localPdfPath));
    }

    return res.redirect(resume.pdfUrl);
});

const getMyResumes = asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ owner: req.user._id }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, resumes, "User resumes fetched successfully"));
});

const getBrowseResumes = asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ owner: { $ne: req.user._id } })
        .populate("owner", "fullName username avatar reputation")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, resumes, "Browse resumes fetched successfully"));
});

const getResumeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const resume = await Resume.findById(id).populate("owner", "fullName username avatar reputation");
    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, resume, "Resume fetched successfully"));
});

const deleteResume = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const resume = await Resume.findById(id);
    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    if (resume.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this resume");
    }

    if (resume.localPdfPath && fs.existsSync(resume.localPdfPath)) {
        fs.unlinkSync(resume.localPdfPath);
    }

    if (resume.pdfPublicId) {
        await deleteFromCloudinary(resume.pdfPublicId, "raw");
    }
    await Review.deleteMany({ resume: resume._id });
    await Resume.findByIdAndDelete(resume._id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Resume deleted successfully"));
});

export {
    uploadResume,
    getResumeFile,
    getMyResumes,
    getBrowseResumes,
    getResumeById,
    deleteResume
};
