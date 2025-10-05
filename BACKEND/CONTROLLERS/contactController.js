import ContactMessage from '../models/ContactMessage.js';

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    await ContactMessage.create({ name, email, message });

    res.status(201).json({ message: 'Thank you for your message! We will get back to you shortly.' });

  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
