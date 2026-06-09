const express = require("express");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");
const verifyFirebaseToken = require("../middleware/firebaseAuth");
const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking (with or without Firebase auth)
// @access  Private (Firebase Auth) or Public (for demo mode with email)
router.post("/", async (req, res, next) => {
  try {
    const { service, brand, technician, problem, date, address, phone, notes, email } = req.body;

    // Validation
    if (!service || !problem || !date || !address || !phone) {
      return res.status(400).json({
        message: "Please provide service, problem, date, address, and phone",
      });
    }

    let user = null;
    
    // Try to verify Firebase token if provided
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        // Use middleware logic directly
        const User = require("../models/User");
        const admin = require("firebase-admin");
        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebaseUid = decodedToken.uid;
        user = await User.findOne({ firebaseUid });
      } catch (err) {
        console.log("Firebase token verification failed, trying email lookup");
      }
    }
    
    // If no user from Firebase, try to find user by email
    if (!user && email) {
      const User = require("../models/User");
      user = await User.findOne({ email: email.toLowerCase() });
      // If user not found by email, create a basic user record
      if (!user && email) {
        user = await User.create({
          name: email.split("@")[0] || "User",
          email: email.toLowerCase(),
          phone: phone || "",
          address: address || "",
        });
      }
    }

    // Create booking
    const booking = await Booking.create({
      user: user ? user._id : null,
      service,
      brand: brand || "",
      technician: technician || "",
      problem,
      date,
      address,
      phone,
      notes: notes || "",
      status: "Pending",
    });

    // Populate user details if user exists
    if (user) {
      await booking.populate("user", "name email phone");
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      message: error.message || "Error creating booking",
    });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings for logged in user
// @access  Private (Firebase Auth)
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      message: error.message || "Error fetching bookings",
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get a single booking
// @access  Private (Firebase Auth)
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      message: error.message || "Error fetching booking",
    });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update a booking
// @access  Private (Firebase Auth)
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const { service, brand, technician, problem, date, address, phone, status, notes } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update fields
    if (service) booking.service = service;
    if (brand !== undefined) booking.brand = brand;
    if (technician !== undefined) booking.technician = technician;
    if (problem) booking.problem = problem;
    if (date) booking.date = date;
    if (address) booking.address = address;
    if (phone) booking.phone = phone;
    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;

    await booking.save();

    res.json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({
      message: error.message || "Error updating booking",
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private (Firebase Auth)
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await Booking.deleteOne({ _id: req.params.id });

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({
      message: error.message || "Error deleting booking",
    });
  }
});

module.exports = router;
