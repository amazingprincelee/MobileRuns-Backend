import express from "express";
import { updatePassword } from "../controllers/userController.js";


const router = express.Router();



// Existing routes
router.put("/update-password/:userId", updatePassword);

export default router;



