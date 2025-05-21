import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  calculatePrice,
  getProviderServices,
  toggleAvailability
} from '../controllers/serviceController.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/calculate-price', calculatePrice);

// Protected routes (require authentication)
router.use(protect);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.get('/provider/services', getProviderServices);
router.patch('/:id/toggle-availability', toggleAvailability);

export default router;