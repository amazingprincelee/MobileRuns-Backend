import express from "express";
import { login, verifyCode } from "../controllers/authController.js";
import { googleAuth } from "../controllers/googleAuthController.js";
const router = express.Router();


router.post("/auth/login", login);
router.post("/auth/verify-code",  verifyCode);
router.post("/auth/google-auth", googleAuth);


export default router;