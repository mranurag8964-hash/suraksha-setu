import express from 'express';
import Incident from '../MODELS/Incident.js';
import { auth } from '../MIDDLEWARE/auth.js';
import { authorize } from '../MIDDLEWARE/roles.js';

const router = express.Router();

// Get all incidents
router.get('/', async (req, res) => {
    try {
        const incidents = await Incident.find()
            .populate('reportedBy', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new incident
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, incidentType, location, anonymous } = req.body;

        const incident = new Incident({
            title,
            description,
            incidentType,
            location,
            anonymous: anonymous || false,
            reportedBy: req.user._id
        });

        await incident.save();
        await incident.populate('reportedBy', 'name email phone');

        res.status(201).json({
            message: 'Incident reported successfully',
            incident
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update incident status (Authority only)
router.put('/:id/status', auth, authorize('Authority'), async (req, res) => {
    try {
        const { status } = req.body;
        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('reportedBy', 'name email phone');

        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        res.json({
            message: 'Incident status updated successfully',
            incident
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;