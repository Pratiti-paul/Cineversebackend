import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../controllers/userController.js";

const router = express.Router();

router.get("/watchlist", verifyToken, getWatchlist);
router.post("/watchlist", verifyToken, addToWatchlist);
router.delete("/watchlist/:id", verifyToken, removeFromWatchlist);

export default router;
