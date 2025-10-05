import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// --- THIS IS THE FIX ---
// Force-load the environment variables from within this file
dotenv.config();

const router = express.Router();

// Now that we are sure the .env file is loaded, we can initialize OpenAI
const openai = new OpenAI();

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message content is required.' });
        }
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful security assistant for the Suraksha Setu application." },
                { role: "user", content: message }
            ],
        });
        res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
        console.error("OpenAI API Error:", err);
        res.status(500).json({ error: 'Failed to get response from AI assistant.' });
    }
});

export default router;