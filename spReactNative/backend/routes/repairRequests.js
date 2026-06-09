const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const RepairRequest = require("../models/RepairRequest");
const { findNearbyTechnicians } = require("../services/technicianGeoService");

// Create a new smart repair request and find nearby technicians
router.post("/", auth, async (req, res, next) => {
  try {
    const { deviceType, issueDescription, lat, lng } = req.body;

    if (!deviceType || !issueDescription || lat == null || lng == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const technicians = await findNearbyTechnicians(lng, lat, 10);

    const repairRequest = await RepairRequest.create({
      user: req.user._id,
      deviceType,
      issueDescription,
      userLocation: { type: "Point", coordinates: [lng, lat] },
      nearbyTechnicians: technicians.map((t) => t._id),
    });

    const io = req.app.get("io");
    if (io) {
      technicians.forEach((tech) => {
        io.to(`technician_${tech._id}`).emit("newRepairRequest", {
          requestId: repairRequest._id,
          deviceType,
          issueDescription,
          userLocation: repairRequest.userLocation,
        });
      });
    }

    res.status(201).json({ repairRequest });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

