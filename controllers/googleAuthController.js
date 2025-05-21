import { OAuth2Client } from 'google-auth-library';
import User from '../models/users.js';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "theskyisblue";

export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        
        if (!idToken) {
            return res.status(400).json({
                message: 'ID token is required'
            });
        }

        // Verify Google ID token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({
                message: 'Invalid token payload'
            });
        }

        const { email, name, picture } = payload;

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                name,
                profilePicture: picture,
                role: 'client',
                hasOnboarded: false
            });
        } else {
            // Update user's information if it exists
            user.name = name;
            user.profilePicture = picture;
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role,
                hasOnboarded: user.hasOnboarded 
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Google authentication successful',
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                hasOnboarded: user.hasOnboarded,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Google authentication error:', error);
        res.status(401).json({
            message: 'Google authentication failed',
            error: error.message
        });
    }
};