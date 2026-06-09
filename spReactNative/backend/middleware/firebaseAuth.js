const admin = require("firebase-admin");
const User = require("../models/User");

// Initialize Firebase Admin (for server-side verification)
// You need to download service account key from Firebase Console
let firebaseAdminInitialized = false;

const initializeFirebaseAdmin = () => {
  if (firebaseAdminInitialized) return;

  try {
    // For now, we'll use a simpler approach with token verification
    // In production, initialize Firebase Admin SDK with service account
    firebaseAdminInitialized = true;
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
};

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const firebaseToken = req.headers.authorization?.replace("Bearer ", "");
    const firebaseUid = req.headers["x-firebase-uid"];

    if (!firebaseToken || !firebaseUid) {
      return res.status(401).json({
        message: "Firebase token and UID are required",
      });
    }

    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please register first.",
      });
    }

    // In production, verify the token with Firebase Admin SDK
    // For now, we'll trust the token if user exists
    // TODO: Implement proper token verification with Firebase Admin SDK

    req.user = user;const admin = require("firebase-admin");
const User = require("../models/User");
const serviceAccount = require("../config/serviceAccountKey.json");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];

    // 🔥 VERIFY TOKEN WITH FIREBASE
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Find user in database
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please register first.",
      });
    }

    req.user = user;
    req.firebaseUid = firebaseUid;

    next();
  } catch (error) {
    console.error("Firebase auth middleware error:", error);
    res.status(401).json({
      message: "Invalid or expired Firebase token",
    });
  }
};

module.exports = verifyFirebaseToken;

    req.firebaseUid = firebaseUid;
    req.firebaseToken = firebaseToken;

    next();
  } catch (error) {
    console.error("Firebase auth middleware error:", error);
    res.status(401).json({
      message: "Invalid Firebase token",
    });
  }
};

module.exports = verifyFirebaseToken;
