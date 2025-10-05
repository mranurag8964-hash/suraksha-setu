import express from 'express';
import Hotspot from '../MODELS/hotspotData.js';

const router = express.Router();

// Get hotspot data
router.get('/hotspots', async (req, res) => {
    try {
        const hotspots = await Hotspot.find();
        res.json(hotspots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;