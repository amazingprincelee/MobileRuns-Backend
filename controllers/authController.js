import jwt from 'jsonwebtoken';
import User from '../models/users.js';

const JWT_SECRET = process.env.JWT_SECRET || "theskyisblue";
const VERIFICATION_CODE_EXPIRY = 300; // 5 minutes in seconds

// In-memory store for verification codes (replace with Redis in production)
const verificationCodes = new Map();

// Generate a random 4-digit code
const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

import { sendTermiiMessage } from '../config/termii.js';
import { sendVerificationCode as sendEmailVerification } from '../config/nodemailer.js';

// Send verification code via selected channel
const sendVerification = async (phone, code, channel) => {
    const message = channel === 'voice' ? code : `Your MobileRuns verification code is: ${code}. Valid for 5 minutes.`;
    return await sendTermiiMessage(phone, message, channel);
};



export const login = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const code = generateVerificationCode();

        // Store the code with timestamp
        verificationCodes.set(email, {
            code,
            timestamp: Date.now(),
            channel: 'email'
        });

        // Send verification code through email
        await sendEmailVerification(email, code);

        res.status(200).json({
            message: 'Verification code sent successfully via email',
            channel: 'email',
            expiresIn: VERIFICATION_CODE_EXPIRY
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to send verification code',
            error: error.message
        });
    }
};



export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        // Get stored verification data
        const storedData = verificationCodes.get(email);

        if (!storedData) {
            return res.status(400).json({
                message: 'No verification code found for this email'
            });
        }

        // Check if code is expired
        if (Date.now() - storedData.timestamp > VERIFICATION_CODE_EXPIRY * 1000) {
            verificationCodes.delete(email);
            return res.status(400).json({
                message: 'Verification code has expired'
            });
        }

        // Verify code
        if (storedData.code !== code) {
            return res.status(400).json({
                message: 'Invalid verification code'
            });
        }

        // Clear the verification code
        verificationCodes.delete(email);

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                role: 'client', // Default role
                password: Math.random().toString(36).slice(-8) // Generate random password
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role, hasOnboarded: user.hasOnboarded },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Email verified successfully',
            token,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Verification failed',
            error: error.message
        });
    }
}