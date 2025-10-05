import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../MODELS/user.js';
import bcrypt from 'bcryptjs';
const router = express.Router();

// Generate JWT Token
const generateToken = (userId, userType) => {
    return jwt.sign(
        { userId, userType },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
    );
};

// Universal Signup - Handles both Citizen and Authority
// NEW ROUTE 1: Handles initial registration and sends OTP
// CORRECTED /register route with password hashing
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, userType, badgeId, station, rank, department } = req.body;

        // This part for checking for an existing user is correct
        const searchConditions = [];
        if (email) searchConditions.push({ email });
        if (phone) searchConditions.push({ phone });
        if (searchConditions.length > 0) {
            const existingVerifiedUser = await User.findOne({
                $or: searchConditions,
                isVerified: true
            });
            if (existingVerifiedUser) {
                return res.status(400).json({ message: 'An account with this email or phone already exists.' });
            }
        }

        // --- THIS IS THE MISSING FIX ---
        // We must manually hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 12);
        // --- END OF FIX ---

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        // Use the 'hashedPassword' variable when creating the user
        await User.findOneAndUpdate(
            { $or: [{ email }, { phone }], isVerified: false },
            { name, email, phone, password: hashedPassword, userType, badgeId, station, rank, department, otp, otpExpires, isVerified: false },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`>>>>>>>>>>>> OTP for ${email || phone} is: ${otp} <<<<<<<<<<<<`);

        res.status(200).json({ success: true, message: 'Verification OTP sent successfully.' });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});
// NEW ROUTE 2: Verifies the OTP and finalizes the account
router.post('/verify', async (req, res) => {
    try {
        const { email, phone, otp } = req.body;
        const user = await User.findOne({ $or: [{ email }, { phone }], isVerified: false });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = generateToken(user._id, user.userType);

        res.status(201).json({
            message: 'Account verified! You are now logged in.',
            token,
            user: { id: user._id, name: user.name, email: user.email, userType: user.userType }
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ message: 'Server error during verification.' });
    }
});

// Login - Universal for both Citizen and Authority
router.post('/login', async (req, res) => {
    try {
        console.log('Login request:', req.body);

        const { email, phone, badgeId, password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Build search query
        const searchConditions = [];
        if (email) searchConditions.push({ email });
        if (phone) searchConditions.push({ phone });
        if (badgeId) searchConditions.push({ badgeId });

        if (searchConditions.length === 0) {
            return res.status(400).json({ message: 'Email, phone, or badge ID is required' });
        }

        // Find user
        const user = await User.findOne({
            $or: searchConditions
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found. Please check your credentials.' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate token
        const token = generateToken(user._id, user.userType);

        res.json({
            message: `Welcome back, ${user.name}!`,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
                badgeId: user.badgeId,
                station: user.station
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Check if user exists (for frontend validation)
router.post('/check-user', async (req, res) => {
    try {
        const { email, phone, badgeId } = req.body;

        const existingUser = await User.findOne({
            $or: [
                { email: email || '' },
                { phone: phone || '' },
                { badgeId: badgeId || '' }
            ].filter(condition => Object.values(condition)[0])
        });

        if (existingUser) {
            // Determine the specific reason for the conflict and send the correct message
            if (badgeId && existingUser.badgeId === badgeId) {
                return res.status(400).json({ message: 'Badge ID already registered' });
            }
            if (email && existingUser.email === email) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }
            if (phone && existingUser.phone === phone) {
                return res.status(400).json({ message: 'User with this phone number already exists' });
            }

            // Fallback message if the conflict reason isn't specific (should not happen often)
            return res.status(400).json({ message: 'User already exists' });
        }
        res.json({ exists: false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;