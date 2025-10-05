import User from '../MODELS/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// --- Helper function to generate JWT ---
const generateToken = (id, userType) => {
    return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token will be valid for 30 days
    });
};

/**
 * @desc    Register a new user (Citizen or Authority)
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res) => {
    try {
        const { name, email, password, contactNumber, userType, badgeId } = req.body;

        // Basic validation
        if (!name || !email || !password || !userType) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user in the database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            contactNumber,
            userType,
            badgeId: userType === 'Authority' ? badgeId : undefined,
        });

        if (user) {
            // Generate a token and send it back
            const token = generateToken(user._id, user.userType);
            res.status(201).json({
                message: 'User registered successfully!',
                token,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data provided.' });
        }
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

/**
 * @desc    Authenticate a user and get a token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and if password matches
        if (user && (await bcrypt.compare(password, user.password))) {
            // Generate a token and send it back
            const token = generateToken(user._id, user.userType);
            res.status(200).json({
                message: 'Login successful!',
                token,
            });
        } else {
            // If user or password don't match, send a generic error
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};