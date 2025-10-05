import express from 'express';
import ContactMessage from '../MODELS/ContactMessage.js';

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const contactMessage = new ContactMessage({
            name,
            email,
            message
        });

        await contactMessage.save();

        res.status(201).json({
            message: 'Thank you for your message. We will get back to you soon!'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;