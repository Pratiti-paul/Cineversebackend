import express from "express";
import { signup, login } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
