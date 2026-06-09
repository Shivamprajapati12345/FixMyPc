const express = require('express');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get user's bookings
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('user', 'name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create booking
router.post('/', protect, async (req, res) => {
  const { service, date } = req.body;
  try {
    const booking = new Booking({
      user: req.user._id,
      service,
      date: new Date(date),
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
