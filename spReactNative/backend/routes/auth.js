const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your_super_secret_jwt_key_change_this_in_production", {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || "",
      address: address || "",
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: error.message || "Error registering user",
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Log failed login attempt
      try {
        const LoginLog = require("../models/LoginLog");
        await LoginLog.create({
          email: email.toLowerCase(),
          loginMethod: "email",
          success: false,
          errorMessage: "User not found",
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
        });
      } catch (logError) {
        console.error("Error logging login attempt:", logError);
      }

      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Log failed login attempt
      try {
        const LoginLog = require("../models/LoginLog");
        await LoginLog.create({
          email: email.toLowerCase(),
          loginMethod: "email",
          success: false,
          errorMessage: "Invalid password",
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
        });
      } catch (logError) {
        console.error("Error logging login attempt:", logError);
      }

      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    // Save successful login activity to MongoDB
    try {
      const LoginLog = require("../models/LoginLog");
      await LoginLog.create({
        user: user._id,
        email: user.email,
        loginMethod: "email",
        success: true,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
      });
    } catch (logError) {
      console.error("Error logging login:", logError);
      // Continue even if logging fails
    }

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: error.message || "Error logging in",
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", require("../middleware/auth"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// @route   POST /api/auth/firebase-register
// @desc    Register user from Firebase (save to MongoDB)
// @access  Public
router.post("/firebase-register", async (req, res) => {
  try {
    const { firebaseUid, name, email, phone, address, firebaseToken } = req.body;

    if (!firebaseUid || !name || !email) {
      return res.status(400).json({
        message: "Firebase UID, name, and email are required",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ firebaseUid });

    if (user) {
      return res.json({
        message: "User already exists",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          joinDate: user.joinDate,
        },
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Create user in MongoDB
    user = await User.create({
      firebaseUid,
      name,
      email,
      phone: phone || "",
      address: address || "",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error("Firebase register error:", error);
    res.status(500).json({
      message: error.message || "Error registering user",
    });
  }
});

// @route   POST /api/auth/firebase-login
// @desc    Login user from Firebase (get from MongoDB)
// @access  Public
router.post("/firebase-login", async (req, res) => {
  try {
    const { firebaseUid, firebaseToken, email } = req.body;

    if (!firebaseUid && !email) {
      return res.status(400).json({
        message: "Firebase UID or email is required",
      });
    }

    // Find user by Firebase UID or email
    let user = null;
    if (firebaseUid) {
      user = await User.findOne({ firebaseUid });
    }
    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      // Log failed login attempt
      try {
        const LoginLog = require("../models/LoginLog");
        await LoginLog.create({
          email: email || "unknown",
          loginMethod: "firebase",
          success: false,
          errorMessage: "User not found",
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
        });
      } catch (logError) {
        console.error("Error logging login attempt:", logError);
      }

      return res.status(404).json({
        message: "User not found. Please register first.",
      });
    }

    // Save successful login activity to MongoDB
    try {
      const LoginLog = require("../models/LoginLog");
      await LoginLog.create({
        user: user._id,
        email: user.email,
        loginMethod: "firebase",
        success: true,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
      });
    } catch (logError) {
      console.error("Error logging login:", logError);
      // Continue even if logging fails
    }

    console.log(`User login: ${user.email} at ${new Date().toISOString()}`);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    res.status(500).json({
      message: error.message || "Error logging in",
    });
  }
});

module.exports = router;
