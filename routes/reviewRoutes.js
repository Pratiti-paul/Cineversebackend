import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { addReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();

// Public: Read reviews
router.get("/:tmdbId", getReviews);

// Protected: Write reviews
router.post("/", verifyToken, addReview);

export default router;
