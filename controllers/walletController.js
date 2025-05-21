import User from '../models/users.js';
import { initializePayment as initFlutterwavePayment, verifyFlutterwavePayment } from '../config/flutterWavePayment.js';
import { chargePatient as initPaystackPayment, verifyTransaction as verifyPaystackTransaction, validateAccountNumber, creditWallet } from '../config/PayStackpaymentService.js';

// Initialize wallet funding
export const initiateFunding = async (req, res) => {
    try {
        const { amount, paymentGateway } = req.body;
        const user = req.user; // Assuming middleware sets this

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        let paymentUrl;
        let reference;

        if (paymentGateway === 'paystack') {
            paymentUrl = await initPaystackPayment(user.email, amount);
            if (!paymentUrl) {
                throw new Error('Failed to initialize Paystack payment');
            }
        } else if (paymentGateway === 'flutterwave') {
            const response = await initFlutterwavePayment(amount, 'NGN');
            paymentUrl = response.data.link;
            reference = response.data.tx_ref;
        } else {
            return res.status(400).json({ message: 'Invalid payment gateway' });
        }

        // Create a pending transaction
        user.wallet.transactions.push({
            type: 'credit',
            amount,
            description: 'Wallet funding',
            reference,
            paymentMethod: paymentGateway
        });
        await user.save();

        res.json({ paymentUrl, reference });
    } catch (error) {
        console.error('Funding initiation error:', error);
        res.status(500).json({ message: 'Error initiating funding' });
    }
};

// Verify wallet funding
export const verifyFunding = async (req, res) => {
    try {
        const { reference, gateway } = req.body;
        const user = req.user;

        let verificationResult;

        if (gateway === 'paystack') {
            verificationResult = await verifyPaystackTransaction(reference);
        } else if (gateway === 'flutterwave') {
            verificationResult = await verifyFlutterwavePayment(reference);
        } else {
            return res.status(400).json({ message: 'Invalid payment gateway' });
        }

        if (!verificationResult.success) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Update transaction status and wallet balance
        const transaction = user.wallet.transactions.find(t => t.reference === reference);
        if (transaction) {
            transaction.status = 'completed';
            user.wallet.balance += transaction.amount;
            await user.save();
        }

        res.json({ message: 'Funding successful', balance: user.wallet.balance });
    } catch (error) {
        console.error('Funding verification error:', error);
        res.status(500).json({ message: 'Error verifying funding' });
    }
};

// Initiate withdrawal
export const initiateWithdrawal = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = req.user;

        if (!user.wallet.bankDetails.accountNumber) {
            return res.status(400).json({ message: 'Please add bank account details first' });
        }

        if (amount > user.wallet.balance) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create a pending withdrawal transaction
        user.wallet.transactions.push({
            type: 'debit',
            amount,
            description: 'Withdrawal to bank account',
            paymentMethod: 'withdrawal',
            status: 'pending'
        });

        // Deduct from wallet balance
        user.wallet.balance -= amount;
        await user.save();

        res.json({ message: 'Withdrawal initiated', balance: user.wallet.balance });
    } catch (error) {
        console.error('Withdrawal initiation error:', error);
        res.status(500).json({ message: 'Error initiating withdrawal' });
    }
};

// Add/Update bank account details
export const updateBankDetails = async (req, res) => {
    try {
        const { accountNumber, bankCode } = req.body;
        const user = req.user;

        // Validate account number with Paystack
        const accountDetails = await validateAccountNumber(accountNumber, bankCode);

        user.wallet.bankDetails = {
            accountNumber,
            accountName: accountDetails.account_name,
            bankCode,
            bankName: accountDetails.bank_name
        };

        await user.save();

        res.json({ message: 'Bank details updated successfully', bankDetails: user.wallet.bankDetails });
    } catch (error) {
        console.error('Bank details update error:', error);
        res.status(500).json({ message: 'Error updating bank details' });
    }
};

// Get wallet balance and transaction history
export const getWalletInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            balance: user.wallet.balance,
            transactions: user.wallet.transactions,
            bankDetails: user.wallet.bankDetails
        });
    } catch (error) {
        console.error('Error fetching wallet info:', error);
        res.status(500).json({ message: 'Error fetching wallet information' });
    }
};