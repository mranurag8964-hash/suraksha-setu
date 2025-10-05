import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './ROUTES/auth.routes.js';
import incidentRoutes from './ROUTES/IncidentRoutes.js';
import mapRoutes from './ROUTES/mapRoutes.js';
//import volunteerRoutes from './ROUTES/volunteer.js';
import contactRoutes from './ROUTES/contact.js';
import assistantRoutes from './ROUTES/assistant.js';
import User from './MODELS/user.js';
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Routes   
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/map', mapRoutes);
// app.use('/api/volunteer', volunteerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/assistant', assistantRoutes);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Suraksha Setu Backend is running!' });
});
// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/suraksha_setu');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});
// --- EMERGENCY SOS ENDPOINT (Updated for Citizens Only) ---

// =======================================================
// --- EMERGENCY SOS ENDPOINT (Updated for Citizens & Authorities) ---
// =======================================================
app.post('/api/emergency/sos', async (req, res) => {
    console.log('EMERGENCY SOS RECEIVED:', req.body);
    
    const { lat, lng } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({ success: false, message: 'Latitude and Longitude are required.' });
    }

    try {
        // Find all CITIZENS and AUTHORITIES within a 1km radius
        const nearbyUsers = await User.find({
            // THIS IS THE CHANGED LINE
            userType: { $in: ['Citizen', 'Authority'] }, 
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat] // [longitude, latitude]
                    },
                    $maxDistance: 1000 // Distance in meters (1km)
                }
            }
        });

        console.log(`Found ${nearbyUsers.length} users (Citizens & Authorities) nearby.`);

        // SIMULATE sending notifications to each nearby user
        nearbyUsers.forEach(user => {
            console.log(`---> Notifying ${user.userType}: ${user.name} (${user.email || user.phone}) about the emergency.`);
        });

        // Send a success response back to the frontend
        res.json({ 
            success: true,
            message: `Emergency alert received! ${nearbyUsers.length} nearby users have been notified.`,
            timestamp: new Date().toISOString(),
            alertId: 'SOS-' + Date.now(),
            notifiedCount: nearbyUsers.length
        });

    } catch (error) {
        console.error('Error processing SOS:', error);
        res.status(500).json({ success: false, message: 'Server error while processing SOS.' });
    }
});


