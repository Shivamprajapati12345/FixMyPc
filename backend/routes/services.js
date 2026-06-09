const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create service (for admin, but for now public)
router.post('/', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const service = new Service({ name, description, price });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
