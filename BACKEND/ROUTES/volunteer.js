// import express from 'express';
// import Volunteer from '../MODELS/volunteer.js';

// const router = express.Router();

// // Join as volunteer
// router.post('/join', async (req, res) => {
//     try {
//         const { name, email, contact, skills, location } = req.body;

//         // Check if volunteer already exists
//         const existingVolunteer = await Volunteer.findOne({ email });
//         if (existingVolunteer) {
//             return res.status(400).json({ message: 'Volunteer with this email already exists' });
//         }

//         const volunteer = new Volunteer({
//             name,
//             email,
//             contact,
//             skills,
//             location
//         });

//         await volunteer.save();

//         res.status(201).json({
//             message: 'Volunteer application submitted successfully',
//             volunteer: {
//                 id: volunteer._id,
//                 name: volunteer.name,
//                 email: volunteer.email,
//                 skills: volunteer.skills
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get volunteer stats and leaderboard
// router.get('/stats', async (req, res) => {
//     try {
//         const totalVolunteers = await Volunteer.countDocuments({ status: 'Active' });
        
//         const leaderboard = await Volunteer.find({ status: 'Active' })
//             .sort({ points: -1 })
//             .limit(10)
//             .select('name points level');

//         res.json({
//             totalVolunteers,
//             leaderboard
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// export default router;