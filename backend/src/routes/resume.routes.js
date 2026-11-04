import { Router } from "express";
import {
    uploadResume,
    getResumeFile,
    getMyResumes,
    getBrowseResumes,
    getResumeById,
    deleteResume
} from "../controllers/resume.controller.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:id/file").get(getResumeFile);

router.use(verifyJWT);

router.route("/")
    .post(upload.single("pdf"), uploadResume);

router.route("/my")
    .get(getMyResumes);

router.route("/browse")
    .get(getBrowseResumes);

router.route("/:id")
    .get(getResumeById)
    .delete(deleteResume);

export default router;
