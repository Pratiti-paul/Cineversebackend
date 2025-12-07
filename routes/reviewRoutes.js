import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { addReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();
router.get("/:tmdbId", getReviews);
router.post("/", verifyToken, addReview);

export default router;
