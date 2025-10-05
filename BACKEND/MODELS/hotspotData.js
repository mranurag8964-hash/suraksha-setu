import mongoose from 'mongoose';

const hotspotSchema = new mongoose.Schema({
    area: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    recentIncidents: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Hotspot', hotspotSchema);