const express = require("express");
const Review = require("../models/Review");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { technician, booking, rating, comment } = req.body;

    if (!technician || !booking || !rating) {
      return res.status(400).json({
        message: "Please provide technician, booking, and rating",
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: "Review already exists for this booking" });
    }

    const review = await Review.create({
      user: req.user._id,
      technician,
      booking,
      rating,
      comment: comment || "",
    });

    await review.populate("user", "name");
    await review.populate("technician", "name");

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      message: error.message || "Error creating review",
    });
  }
});

// @route   GET /api/reviews/technician/:id
// @desc    Get reviews for a technician
// @access  Public
router.get("/technician/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ technician: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      message: error.message || "Error fetching reviews",
    });
  }
});

// @route   GET /api/reviews/user
// @desc    Get reviews by logged in user
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("technician", "name")
      .populate("booking", "service date")
      .sort({ createdAt: -1 });

    res.json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({
      message: error.message || "Error fetching reviews",
    });
  }
});

module.exports = router;
