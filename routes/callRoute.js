import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  initiateCall,
  updateCallStatus,
  getCallHistory,
} from "../controllers/callController.js";

const router = express.Router();

router.post("/calls/initiate", authenticateToken, initiateCall);
router.put("/calls/:callId/status", authenticateToken, updateCallStatus);
router.get("/calls/history", authenticateToken, getCallHistory);

export default router;