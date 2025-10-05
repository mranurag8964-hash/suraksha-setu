import express from 'express';
import authRoutes from './auth.routes.js';
import incidentRoutes from './IncidentRoutes.js';
import mapRoutes from './mapRoutes.js';
import volunteerRoutes from './volunteer.js';
import contactRoutes from './contact.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/incidents', incidentRoutes);
router.use('/map', mapRoutes);
router.use('/volunteer', volunteerRoutes);
router.use('/contact', contactRoutes);

export default router;