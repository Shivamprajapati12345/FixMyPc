const express = require("express");
const Technician = require("../models/Technician");
const router = express.Router();

// @route   GET /api/technicians
// @desc    Get all technicians (with optional brand filter)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { brand } = req.query;
    const query = brand ? { brands: { $in: [brand] }, isAvailable: true } : { isAvailable: true };

    const technicians = await Technician.find(query).sort({ rating: -1, experience: -1 });

    res.json({
      count: technicians.length,
      technicians,
    });
  } catch (error) {
    console.error("Get technicians error:", error);
    res.status(500).json({
      message: error.message || "Error fetching technicians",
    });
  }
});

// @route   GET /api/technicians/:id
// @desc    Get a single technician
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    res.json({ technician });
  } catch (error) {
    console.error("Get technician error:", error);
    res.status(500).json({
      message: error.message || "Error fetching technician",
    });
  }
});

// @route   POST /api/technicians
// @desc    Create a new technician (Admin only - for now public for setup)
// @access  Public (should be protected in production)
router.post("/", async (req, res) => {
  try {
    const technician = await Technician.create(req.body);
    res.status(201).json({
      message: "Technician created successfully",
      technician,
    });
  } catch (error) {
    console.error("Create technician error:", error);
    res.status(500).json({
      message: error.message || "Error creating technician",
    });
  }
});

// @route   POST /api/technicians/register
// @desc    Register as a technician (self-registration)
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      experience,
      specialization,
      brands,
      price,
      location,
      bio,
    } = req.body;

    // Validation
    if (!name || !email || !phone || !experience || !brands || !price) {
      return res.status(400).json({
        message: "Please provide name, email, phone, experience, brands, and price",
      });
    }

    // Check if email already exists
    const existingTech = await Technician.findOne({ email: email.toLowerCase() });
    if (existingTech) {
      return res.status(400).json({
        message: "A technician with this email already exists",
      });
    }

    // Validate brands array
    const brandsArray = Array.isArray(brands) ? brands : brands.split(",").map((b) => b.trim());
    if (brandsArray.length === 0) {
      return res.status(400).json({
        message: "At least one brand is required",
      });
    }

    // Create technician
    const technician = await Technician.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      experience: parseInt(experience),
      specialization: specialization
        ? (Array.isArray(specialization)
            ? specialization
            : specialization.split(",").map((s) => s.trim()))
        : [],
      brands: brandsArray,
      price: parseInt(price),
      location: location ? location.trim() : "",
      bio: bio ? bio.trim() : "",
      isAvailable: true,
      rating: 0,
      totalReviews: 0,
    });

    console.log(`New technician registered: ${technician.name} (${technician.email}) at ${new Date().toISOString()}`);

    res.status(201).json({
      message: "Technician registration successful! Your profile will be reviewed soon.",
      technician: {
        id: technician._id,
        name: technician.name,
        email: technician.email,
        phone: technician.phone,
        experience: technician.experience,
        brands: technician.brands,
        price: technician.price,
        isAvailable: technician.isAvailable,
      },
    });
  } catch (error) {
    console.error("Technician registration error:", error);
    
    let errorMessage = "Error registering technician";
    if (error.code === 11000) {
      // Duplicate key error
      if (error.keyPattern?.email) {
        errorMessage = "This email is already registered";
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      message: errorMessage,
    });
  }
});

module.exports = router;
