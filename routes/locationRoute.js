import express from "express";
import { getRouteDirections, getEstimatedArrival, getCoordinates } from "../controllers/locationController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get route directions
router.post("/location/route", authenticateToken, getRouteDirections);

// Get estimated time of arrival
router.post("/location/eta", authenticateToken, getEstimatedArrival);

// Get coordinates from address
router.post("/location/geocode", authenticateToken, getCoordinates);

export default router;