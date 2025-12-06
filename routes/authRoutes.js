import express from "express";
import { signup, login,logout,verify } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verify);


export default router;
