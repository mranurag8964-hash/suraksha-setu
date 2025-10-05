// import mongoose from 'mongoose';

// const volunteerSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true
//     },
//     contact: {
//         type: String,
//         required: true
//     },
//     skills: {
//         type: String,
//         required: true,
//         enum: ['first-aid', 'tech-support', 'awareness', 'emergency-response', 'counseling', 'translation']
//     },
//     location: {
//         type: String,
//         required: true
//     },
//     points: {
//         type: Number,
//         default: 0
//     },
//     level: {
//         type: String,
//         enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
//         default: 'Bronze'
//     },
//     status: {
//         type: String,
//         enum: ['Active', 'Inactive'],
//         default: 'Active'
//     }
// }, {
//     timestamps: true
// });

// export default mongoose.model('Volunteer', volunteerSchema);