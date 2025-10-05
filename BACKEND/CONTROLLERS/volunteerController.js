// import Volunteer from '../MODELS/volunteer.js';

// // @desc    Register a new volunteer application
// // @route   POST /api/volunteer/join
// // @access  Public
// export const joinVolunteerProgram = async (req, res) => {
//   try {
//     const { name, contactNumber, email, skills, location } = req.body;

//     // Check if a volunteer with this email already exists
//     const volunteerExists = await Volunteer.findOne({ email });
//     if (volunteerExists) {
//       return res.status(400).json({ message: 'An application with this email already exists.' });
//     }

//     // Create a new volunteer application
//     const volunteer = await Volunteer.create({
//       name,
//       contactNumber,
//       email,
//       skills,
//       location,
//     });

//     if (volunteer) {
//       res.status(201).json({
//         message: 'Thank you for your application! We will review it and get back to you shortly.',
//       });
//     } else {
//       res.status(400).json({ message: 'Invalid volunteer data provided.' });
//     }
//   } catch (error) {
//     console.error('Volunteer Join Error:', error);
//     res.status(500).json({ message: 'Server error while processing your application.' });
//   }
// };
