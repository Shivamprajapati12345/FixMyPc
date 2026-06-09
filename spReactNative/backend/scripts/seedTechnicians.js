const mongoose = require("mongoose");
const Technician = require("../models/Technician");
require("dotenv").config();

const technicians = [
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@fixmypc.com",
    phone: "+91 9876543210",
    experience: 5,
    specialization: ["Screen Repair", "Hardware", "Battery Replacement"],
    brands: ["HP"],
    rating: 4.8,
    totalReviews: 45,
    price: 499,
    location: "Delhi",
    isAvailable: true,
    bio: "Expert in HP laptop repairs with 5+ years of experience",
  },
  {
    name: "Amit Verma",
    email: "amit.verma@fixmypc.com",
    phone: "+91 9876543211",
    experience: 4,
    specialization: ["OS Installation", "Virus Removal"],
    brands: ["Dell", "HP"],
    rating: 4.6,
    totalReviews: 32,
    price: 399,
    location: "Mumbai",
    isAvailable: true,
    bio: "Specialized in software issues and OS installations",
  },
  {
    name: "Suresh Kumar",
    email: "suresh.kumar@fixmypc.com",
    phone: "+91 9876543212",
    experience: 7,
    specialization: ["Data Recovery", "Hardware Repair"],
    brands: ["Lenovo", "Dell"],
    rating: 4.9,
    totalReviews: 67,
    price: 699,
    location: "Bangalore",
    isAvailable: true,
    bio: "Senior technician with expertise in data recovery",
  },
  {
    name: "Neeraj Singh",
    email: "neeraj.singh@fixmypc.com",
    phone: "+91 9876543213",
    experience: 3,
    specialization: ["Screen Repair", "Keyboard Fix"],
    brands: ["Asus"],
    rating: 4.5,
    totalReviews: 28,
    price: 399,
    location: "Pune",
    isAvailable: true,
    bio: "Quick and efficient Asus repair specialist",
  },
  {
    name: "Mohit Jain",
    email: "mohit.jain@fixmypc.com",
    phone: "+91 9876543214",
    experience: 7,
    specialization: ["Hardware Upgrade", "Performance Boost"],
    brands: ["Acer"],
    rating: 4.7,
    totalReviews: 52,
    price: 649,
    location: "Hyderabad",
    isAvailable: true,
    bio: "Expert in Acer laptop upgrades and repairs",
  },
  {
    name: "Rohit Mehta",
    email: "rohit.mehta@fixmypc.com",
    phone: "+91 9876543215",
    experience: 5,
    specialization: ["MacBook Repair", "macOS Support"],
    brands: ["MacBook"],
    rating: 4.9,
    totalReviews: 38,
    price: 799,
    location: "Delhi",
    isAvailable: true,
    bio: "Apple-certified MacBook repair specialist",
  },
  {
    name: "Amit Sharma",
    email: "amit.sharma@fixmypc.com",
    phone: "+91 9876543216",
    experience: 5,
    specialization: ["MacBook Repair", "Data Recovery"],
    brands: ["MacBook"],
    rating: 4.8,
    totalReviews: 42,
    price: 799,
    location: "Mumbai",
    isAvailable: true,
    bio: "5 years of Apple-certified MacBook repair experience",
  },
  {
    name: "Rahul Mehta",
    email: "rahul.mehta@fixmypc.com",
    phone: "+91 9876543217",
    experience: 8,
    specialization: ["MacBook Repair", "Hardware"],
    brands: ["MacBook"],
    rating: 5.0,
    totalReviews: 58,
    price: 999,
    location: "Bangalore",
    isAvailable: true,
    bio: "8 years Mac specialist with premium service",
  },
];

const seedTechnicians = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://shivam0987:shivam123@cluster0.thkv62f.mongodb.net/fixmypc?retryWrites=true&w=majority&appName=Cluster0";
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing technicians
    await Technician.deleteMany({});
    console.log("Cleared existing technicians");

    // Insert new technicians
    await Technician.insertMany(technicians);
    console.log(`✅ Seeded ${technicians.length} technicians`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding technicians:", error);
    process.exit(1);
  }
};

seedTechnicians();
