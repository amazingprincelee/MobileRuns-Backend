import { calculateRoute, getETA, geocodeAddress } from "../utils/maps.js";

// Get route directions for provider
export const getRouteDirections = async (req, res) => {
  try {
    const { origin, destination } = req.body;
    const routeData = await calculateRoute(origin, destination);
    res.status(200).json(routeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get estimated time of arrival
export const getEstimatedArrival = async (req, res) => {
  try {
    const { origin, destination } = req.body;
    const etaData = await getETA(origin, destination);
    res.status(200).json(etaData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Convert address to coordinates
export const getCoordinates = async (req, res) => {
  try {
    const { address } = req.body;
    const geocodeData = await geocodeAddress(address);
    res.status(200).json(geocodeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};