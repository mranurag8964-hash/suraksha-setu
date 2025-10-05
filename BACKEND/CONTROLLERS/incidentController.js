import Incident from '../MODELS/Incident.js';

/**
 * @desc    Create a new incident report
 * @route   POST /api/incidents
 * @access  Private (Requires user to be logged in)
 */
export const createIncident = async (req, res) => {
    try {
        const { title, description, incidentType, location } = req.body;

        // Basic validation
        if (!title || !description || !incidentType || !location) {
            return res.status(400).json({ message: 'Please provide all required fields: title, description, type, and location.' });
        }

        // Create a new incident linked to the logged-in user
        const incident = new Incident({
            title,
            description,
            incidentType,
            location,
            reportedBy: req.user._id, // req.user is attached by the 'protect' middleware
        });

        const createdIncident = await incident.save();
        res.status(201).json({
            message: 'Incident reported successfully!',
            incident: createdIncident,
        });

    } catch (error) {
        console.error('Create Incident Error:', error);
        res.status(500).json({ message: 'Server error while creating incident.', error: error.message });
    }
};

/**
 * @desc    Get all incident reports (can be filtered later)
 * @route   GET /api/incidents
 * @access  Public (Anyone can see the list of incidents)
 */
export const getIncidents = async (req, res) => {
    try {
        // Find all incidents and populate the 'reportedBy' field with the user's name and email
        const incidents = await Incident.find({})
            .populate('reportedBy', 'name email') // Replaces reportedBy ID with user's name and email
            .sort({ createdAt: -1 }); // Show the newest incidents first

        res.status(200).json(incidents);

    } catch (error) {
        console.error('Get Incidents Error:', error);
        res.status(500).json({ message: 'Server error while fetching incidents.', error: error.message });
    }
};
