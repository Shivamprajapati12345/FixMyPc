const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Seed services if empty
    const Service = require('./models/Service');
    const count = await Service.countDocuments();
    if (count === 0) {
      const services = [
        { name: 'Hardware Repair', description: 'Fix broken components like RAM, HDD, motherboard.', price: '699 - 1499' },
        { name: 'Software Installation', description: 'Install OS, drivers, and essential software.', price: '699 - 999' },
        { name: 'Virus Removal', description: 'Clean malware and optimize system performance.', price: '699 - 999' },
        { name: 'Data Recovery', description: 'Recover lost data from damaged drives.', price: '699 - 1599' },
        { name: 'PC Upgrade', description: 'Upgrade RAM, SSD, GPU for better performance.', price: '699 - 799' },
      ];
      await Service.insertMany(services);
      console.log('Services seeded');
    }
  })
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
