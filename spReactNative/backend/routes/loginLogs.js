const express = require("express");
const LoginLog = require("../models/LoginLog");
const router = express.Router();

// @route   GET /api/login-logs
// @desc    Get login logs (for admin/monitoring)
// @access  Public (should be protected in production)
router.get("/", async (req, res) => {
  try {
    const { email, limit = 100 } = req.query;
    
    const query = email ? { email: email.toLowerCase() } : {};
    
    const logs = await LoginLog.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error("Get login logs error:", error);
    res.status(500).json({
      message: error.message || "Error fetching login logs",
    });
  }
});

// @route   GET /api/login-logs/stats
// @desc    Get login statistics
// @access  Public (should be protected in production)
router.get("/stats", async (req, res) => {
  try {
    const totalLogins = await LoginLog.countDocuments({ success: true });
    const failedLogins = await LoginLog.countDocuments({ success: false });
    const todayLogins = await LoginLog.countDocuments({
      success: true,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    res.json({
      totalLogins,
      failedLogins,
      todayLogins,
      successRate: totalLogins + failedLogins > 0 
        ? ((totalLogins / (totalLogins + failedLogins)) * 100).toFixed(2) 
        : 0,
    });
  } catch (error) {
    console.error("Get login stats error:", error);
    res.status(500).json({
      message: error.message || "Error fetching login stats",
    });
  }
});

module.exports = router;
