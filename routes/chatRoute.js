import express from "express";
import { getChatHistory, markMessagesAsRead } from "../controllers/chatController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get chat history for a specific job
router.get("/chat/:jobId", authenticateToken, getChatHistory);

// Mark messages as read
router.put("/chat/:jobId/:userId/read", authenticateToken, markMessagesAsRead);

export default router;