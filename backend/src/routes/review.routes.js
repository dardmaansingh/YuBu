import { Router } from "express";
import {
    createReview,
    getResumeReviews
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/:resumeId")
    .post(createReview)
    .get(getResumeReviews);

export default router;
