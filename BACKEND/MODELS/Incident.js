import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    incidentType: {
        type: String,
        required: true,
        enum: ['Theft', 'Harassment', 'Vehicle Theft', 'Burglary', 'Fraud', 'Assault', 'Other']
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Solved'],
        default: 'Pending'
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    anonymous: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Incident', incidentSchema);