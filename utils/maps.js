import axios from "axios";

// Function to calculate route between provider and client location
export const calculateRoute = async (origin, destination) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to calculate route: " + error.message);
  }
};

// Function to get estimated time of arrival
export const getETA = async (origin, destination) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to get ETA: " + error.message);
  }
};

// Function to geocode address to coordinates
export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to geocode address: " + error.message);
  }
};