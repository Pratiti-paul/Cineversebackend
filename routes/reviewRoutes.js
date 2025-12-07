import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { addReview, getReviews, deleteReview } from "../controllers/reviewController.js";

const router = express.Router();
router.get("/:tmdbId", getReviews);
router.post("/", verifyToken, addReview);
router.delete("/:id", verifyToken, deleteReview);

export default router;
