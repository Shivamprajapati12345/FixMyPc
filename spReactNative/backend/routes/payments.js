const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const verifyFirebaseToken = require("../middleware/firebaseAuth");
const router = express.Router();

// Initialize Razorpay
// Replace with your actual Razorpay keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_RAZORPAY_KEY_SECRET",
});

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private (Firebase Auth)
router.post("/create-order", verifyFirebaseToken, async (req, res) => {
  try {
    const { amount, currency, bookingId, description } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({
        message: "Amount and bookingId are required",
      });
    }

    // Verify booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Create Razorpay order
    const options = {
      amount: amount, // Amount in paise
      currency: currency || "INR",
      receipt: `receipt_${bookingId}_${Date.now()}`,
      notes: {
        bookingId: bookingId.toString(),
        userId: req.user._id.toString(),
        service: booking.service,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
      user: req.user._id,
      booking: bookingId,
      amount: amount / 100, // Convert paise to rupees
      currency: currency || "INR",
      razorpayOrderId: order.id,
      status: "pending",
      description: description || booking.service,
      receipt: order.receipt,
    });

    res.json({
      message: "Order created successfully",
      order: {
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        userEmail: req.user.email,
        userPhone: req.user.phone,
        userName: req.user.name,
      },
      payment: {
        id: payment._id,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      message: error.message || "Error creating order",
    });
  }
});

// @route   POST /api/payments/verify-payment
// @desc    Verify Razorpay payment
// @access  Private (Firebase Auth)
router.post("/verify-payment", verifyFirebaseToken, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        message: "Payment verification data is required",
      });
    }

    // Verify signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "YOUR_RAZORPAY_KEY_SECRET")
      .update(text)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId, user: req.user._id },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: "completed",
      },
      { new: true }
    ).populate("booking");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update booking status
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        status: "Confirmed",
      });
    }

    res.json({
      message: "Payment verified successfully",
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        razorpayPaymentId: payment.razorpayPaymentId,
        createdAt: payment.createdAt,
      },
      booking: payment.booking,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      message: error.message || "Error verifying payment",
    });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history for user
// @access  Private (Firebase Auth)
router.get("/history", verifyFirebaseToken, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("booking", "service date status")
      .sort({ createdAt: -1 });

    res.json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({
      message: error.message || "Error fetching payment history",
    });
  }
});

// @route   GET /api/payments/:id
// @desc    Get single payment
// @access  Private (Firebase Auth)
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("booking");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ payment });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({
      message: error.message || "Error fetching payment",
    });
  }
});

// @route   POST /api/payments/mock-payment
// @desc    Save mock payment to MongoDB
// @access  Public (for demo/testing)
router.post("/mock-payment", async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, status, transactionId, service, brand, technician, userEmail } = req.body;

    if (!amount || !transactionId) {
      return res.status(400).json({
        message: "Amount and transaction ID are required",
      });
    }

    // Find or create user by email
    let user = null;
    if (userEmail) {
      user = await require("../models/User").findOne({ email: userEmail.toLowerCase() });
      // If user not found by email, try to create/update profile
      if (!user) {
        // Try to find by Firebase UID from request headers if available
        const firebaseUid = req.headers["x-firebase-uid"];
        if (firebaseUid) {
          user = await require("../models/User").findOne({ firebaseUid });
        }
      }
    }

    // Find booking if bookingId provided
    let booking = null;
    if (bookingId) {
      booking = await Booking.findById(bookingId);
    }

    // Create mock payment record
    const payment = await Payment.create({
      user: user ? user._id : null,
      userEmail: userEmail ? userEmail.toLowerCase() : null,
      booking: booking ? booking._id : null,
      amount: amount,
      currency: "INR",
      razorpayOrderId: `MOCK_${transactionId}`,
      razorpayPaymentId: transactionId,
      status: status || "completed",
      paymentMethod: paymentMethod || "mock",
      description: `Mock payment for ${service || "Service"}${brand ? ` - ${brand}` : ""}${technician ? ` - ${technician}` : ""}`,
      receipt: `receipt_${transactionId}`,
    });

    // Update booking status if booking exists
    if (booking) {
      booking.status = "Confirmed";
      await booking.save();
    }

    res.status(201).json({
      message: "Mock payment saved successfully",
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        transactionId: payment.razorpayPaymentId,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    console.error("Mock payment error:", error);
    res.status(500).json({
      message: error.message || "Error saving mock payment",
    });
  }
});

module.exports = router;
