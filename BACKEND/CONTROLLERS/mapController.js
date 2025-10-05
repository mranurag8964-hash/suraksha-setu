import HotspotData from '../MODELS/hotspotData.js';

// @desc    Get all active hotspots
// @route   GET /api/map/hotspots
// @access  Public
export const getHotspots = async (req, res) => {
  try {
    const hotspots = await HotspotData.find({});
    res.status(200).json(hotspots);
  } catch (error) {
    console.error('Error fetching hotspots:', error);
    res.status(500).json({ message: 'Server error while fetching hotspot data.' });
  }
};

// @desc    Add a new hotspot (for admin/internal use)
// @route   POST /api/map/hotspots
// @access  Private/Admin
export const addHotspot = async (req, res) => {
  try {
    const { area, longitude, latitude, riskLevel, recentIncidents } = req.body;

    if (!area || !longitude || !latitude || !riskLevel) {
      return res.status(400).json({ message: 'Please provide all required fields for the hotspot.' });
    }

    const hotspot = new HotspotData({
      area,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      riskLevel,
      recentIncidents,
    });

    await hotspot.save();
    res.status(201).json({ message: 'Hotspot added successfully.', hotspot });

  } catch (error) {
    console.error('Error adding hotspot:', error);
    res.status(500).json({ message: 'Server error while adding hotspot data.' });
  }
};
