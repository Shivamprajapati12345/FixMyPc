const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Quotation = require("../models/Quotation");
const RepairRequest = require("../models/RepairRequest");
const Technician = require("../models/Technician");

// Technician submits or updates a quotation
router.post("/", auth, async (req, res, next) => {
  try {
    const { repairRequestId, price, message, etaHours } = req.body;

    if (!repairRequestId || price == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const technician = await Technician.findOne({ email: req.user.email });
    if (!technician) {
      return res
        .status(403)
        .json({ message: "No technician account linked to this user" });
    }

    const repairRequest = await RepairRequest.findById(repairRequestId);
    if (!repairRequest) {
      return res.status(404).json({ message: "Repair request not found" });
    }

    if (!repairRequest.nearbyTechnicians.some((id) => id.equals(technician._id))) {
      return res
        .status(403)
        .json({ message: "You are not allowed to quote on this request" });
    }

    const quotation = await Quotation.findOneAndUpdate(
      { repairRequest: repairRequestId, technician: technician._id },
      { price, message, etaHours },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    repairRequest.status = "quotes_received";
    await repairRequest.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`request_${repairRequestId}`).emit("newQuotation", {
        _id: quotation._id,
        repairRequest: quotation.repairRequest,
        technician: { _id: technician._id, name: technician.name },
        price: quotation.price,
        message: quotation.message,
        etaHours: quotation.etaHours,
      });
    }

    res.status(201).json({ quotation });
  } catch (err) {
    next(err);
  }
});

// Get all quotations for a repair request
router.get("/by-request/:id", auth, async (req, res, next) => {
  try {
    const quotations = await Quotation.find({
      repairRequest: req.params.id,
    }).populate("technician", "name");

    res.json({ quotations });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

