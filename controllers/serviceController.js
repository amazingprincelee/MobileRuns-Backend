import Service from '../models/services.js';
import { calculateDistance } from '../utils/maps.js';

// Create a new service
export const createService = async (req, res) => {
  try {
    const service = new Service({
      ...req.body,
      provider: req.user._id // Provider ID from authenticated user
    });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all services
export const getServices = async (req, res) => {
  try {
    const { type, lat, lng, radius = 10 } = req.query; // radius in kilometers
    
    let query = {};
    if (type) {
      query.name = type;
    }

    // If location is provided, find services within radius
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const services = await Service.find(query).populate('provider', 'name phone rating');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name phone rating');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Ensure provider can only update their own service
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(service, req.body);
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Ensure provider can only delete their own service
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await service.remove();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate service price
export const calculatePrice = async (req, res) => {
  try {
    const { serviceId, userLat, userLng, params } = req.body;
    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Calculate distance between user and service provider
    const distance = await calculateDistance(
      [userLng, userLat],
      service.location.coordinates
    );

    // Calculate final price based on distance and service parameters
    const price = service.calculatePrice(distance, params);

    res.json({
      basePrice: service.basePrice,
      distance,
      finalPrice: price,
      currency: 'NGN'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get provider's services
export const getProviderServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle service availability
export const toggleAvailability = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Ensure provider can only toggle their own service
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    service.isAvailable = !service.isAvailable;
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};