import express from 'express';
import { initiateFunding, verifyFunding, initiateWithdrawal, updateBankDetails, getWalletInfo } from '../controllers/walletController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Wallet funding routes
router.post('/fund', initiateFunding);
router.post('/verify-funding', verifyFunding);

// Withdrawal routes
router.post('/withdraw', initiateWithdrawal);
router.post('/bank-details', updateBankDetails);

// Wallet information
router.get('/info', getWalletInfo);

export default router;