const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/technicians", require("./routes/technicians"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/login-logs", require("./routes/loginLogs"));
app.use("/api/repair-requests", require("./routes/repairRequests"));
app.use("/api/quotations", require("./routes/quotations"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!", status: "OK" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to MongoDB
// MongoDB credentials (no special characters, so no encoding needed)
const MONGO_USERNAME = "shivam_404Db";
const MONGO_PASSWORD = "shivam0987p";
const MONGO_CLUSTER = "cluster0.f4ls2hs.mongodb.net";
const MONGO_DB = "fixmypc";

// Build MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;

// Validate MongoDB URI format
if (MONGODB_URI.includes("mongodb+srv://") && MONGODB_URI.match(/:\d+/)) {
  console.error("❌ Error: mongodb+srv URI cannot contain port number");
  console.error("Please remove any port number from the connection string");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid conflict

    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    app.set("io", io);

    io.use((socket, next) => {
      const { userId, role, technicianId } = socket.handshake.auth || {};
      socket.user = { id: userId, role, technicianId };
      next();
    });

    io.on("connection", (socket) => {
      const { role, technicianId } = socket.user;
      if (role === "technician" && technicianId) {
        socket.join(`technician_${technicianId}`);
      }

      socket.on("joinRequestRoom", (requestId) => {
        socket.join(`request_${requestId}`);
      });
    });

    const server = httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
    });

    // Handle port already in use error
    server.on("error", (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use!`);
        console.error(`💡 Solutions:`);
        console.error(`1. Kill the process using port ${PORT}:`);
        console.error(`   Windows: netstat -ano | findstr :${PORT}`);
        console.error(`   Then: taskkill /PID <PID> /F`);
        console.error(`   Or use: npx kill-port ${PORT}`);
        console.error(`2. Use a different port by setting PORT environment variable:`);
        console.error(`   PORT=5001 npm run dev`);
        console.error(`3. Or change the default port in server.js`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    
    if (err.message.includes("bad auth") || err.message.includes("Authentication failed")) {
      console.error("\n💡 Authentication Failed!");
      console.error("Possible issues:");
      console.error("1. Username or password is incorrect");
      console.error("2. Username contains special characters that need URL encoding");
      console.error("   - @ should be encoded as %40");
      console.error("   - Example: shivam@404 -> shivam%40404");
      console.error("3. Database user doesn't exist or doesn't have access");
      console.error("4. IP address not whitelisted in MongoDB Atlas");
      console.error("\n📝 To fix:");
      console.error("1. Check your MongoDB Atlas credentials");
      console.error("2. Make sure your IP is whitelisted (0.0.0.0/0 for all IPs)");
      console.error("3. Create a .env file with: MONGODB_URI=your_connection_string");
      console.error("4. Verify username/password in MongoDB Atlas");
    } else if (err.message.includes("port")) {
      console.error("💡 Tip: mongodb+srv URIs should not contain port numbers");
      console.error("💡 Make sure your connection string format is: mongodb+srv://username:password@host/database");
    } else if (err.message.includes("ENOTFOUND") || err.message.includes("getaddrinfo")) {
      console.error("💡 Network error: Check your internet connection or MongoDB cluster URL");
    }
    
    console.error("\n🔧 Connection Details:");
    console.error(`   Username: ${MONGO_USERNAME}`);
    console.error(`   Password: ${MONGO_PASSWORD.replace(/./g, "*")}`);
    console.error(`   Cluster: ${MONGO_CLUSTER}`);
    console.error(`   Database: ${MONGO_DB}`);
    console.error("\n🔧 Encoded URI (masked):");
    const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ":****@");
    console.error(maskedUri);
    console.error("\n💡 Try these steps:");
    console.error("1. Go to MongoDB Atlas → Database Access");
    console.error("2. Verify username and password are correct");
    console.error("3. Go to Network Access → Add IP Address → 0.0.0.0/0 (allow all)");
    console.error("4. Make sure user has 'Atlas admin' or 'Read and write to any database' role");
    
    process.exit(1);
  });

module.exports = app;
