const Technician = require("../models/Technician");

async function findNearbyTechnicians(lng, lat, radiusKm = 10) {
  return Technician.find({
    geoLocation: {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: radiusKm * 1000,
      },
    },
    isAvailable: true,
  });
}

module.exports = { findNearbyTechnicians };

