const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const { protect, admin } = require('../middleware/authMiddleware');

// Create a consultation (protected)
router.post('/', protect, async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    if (req.user) consultation.user = req.user._id;
    await consultation.save();
    res.status(201).json(consultation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create consultation' });
  }
});

// Get all consultations for a user (protected)
router.get('/', protect, async (req, res) => {
  try {
    const consultations = await Consultation.find({ user: req.user._id });
    res.json(consultations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch consultations' });
  }
});

// Get all consultations (admin)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const consultations = await Consultation.find();
    res.json(consultations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch all consultations' });
  }
});

module.exports = router; 