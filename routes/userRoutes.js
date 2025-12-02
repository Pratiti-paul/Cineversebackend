import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getWatchlist, addToWatchlist, removeFromWatchlist, getProfile, updateProfile} from "../controllers/userController.js";

const router = express.Router();

router.get("/watchlist", verifyToken, getWatchlist);
router.post("/watchlist", verifyToken, addToWatchlist);
router.delete("/watchlist/:id", verifyToken, removeFromWatchlist);

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

export default router;
