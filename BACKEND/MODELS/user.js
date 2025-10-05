import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: function () {
            return !this.phone && !this.badgeId;
        },
        unique: true,
        sparse: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: function () {
            return !this.email && !this.badgeId;
        },
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userType: {
        type: String,
        enum: ['Citizen', 'Authority'],
        required: true
    },
    // Authority specific fields
    badgeId: {
        type: String,
        unique: true,
        sparse: true
    },
    station: {
        type: String,
        sparse: true
    },
    rank: {
        type: String,
        sparse: true
    },
    department: {
        type: String,
        sparse: true
    },
    // Citizen specific fields
    address: {
        type: String,
        sparse: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    }

}, {
    timestamps: true
});
userSchema.index({ location: '2dsphere' });
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);