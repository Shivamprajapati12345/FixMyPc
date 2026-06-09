import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

const { width } = Dimensions.get("window");

const Home = () => {
  const navigation = useNavigation();

  const stats = [
    { icon: "👥", number: "50+", label: "Happy Customers" },
    { icon: "⭐", number: "4.8", label: "Average Rating" },
    { icon: "🔧", number: "20+", label: "Expert Technicians" },
    { icon: "🏆", number: "10+", label: "Repairs Done" },
  ];

  const features = [
    { icon: "🏠", title: "Home Service", desc: "We come to you" },
    { icon: "⚡", title: "Fast Repair", desc: "Same day service" },
    { icon: "💰", title: "Best Price", desc: "Transparent pricing" },
    { icon: "✅", title: "Warranty", desc: "90 days guarantee" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Navbar navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO SECTION */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
          }}
          style={styles.bgImage}
          imageStyle={{ opacity: 0.25 }}
        >
          <View style={styles.overlay}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>💻</Text>
            </View>
            <Text style={styles.title}>FixMyPC</Text>
            <Text style={styles.subtitle}>
              Professional Laptop & Computer Repair
            </Text>
            <Text style={styles.tagline}>
              At Your Doorstep ✨
            </Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => navigation.navigate("Booking")}
              >
                <Text style={styles.btnPrimaryText}>🚀 Book Repair Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => navigation.navigate("Services")}
              >
                <Text style={styles.btnSecondaryText}>View Services</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* STATS SECTION */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* FEATURES SECTION */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose Us? 🌟</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* BRANDS SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔧 Choose Your Brand</Text>
            <Text style={styles.sectionSubtitle}>
              Select your device brand for specialized repair
            </Text>
          </View>

          <View style={styles.brandButtons}>
            <TouchableOpacity
              style={[styles.brandBtn, styles.brandBtnHP]}
              onPress={() => navigation.navigate("HP")}
            >
              <Text style={styles.brandIcon}>💻</Text>
              <Text style={styles.brandText}>HP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.brandBtn, styles.brandBtnDell]}
              onPress={() => navigation.navigate("Dell")}
            >
              <Text style={styles.brandIcon}>💻</Text>
              <Text style={styles.brandText}>Dell</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.brandBtn, styles.brandBtnLenovo]}
              onPress={() => navigation.navigate("Lenovo")}
            >
              <Text style={styles.brandIcon}>💻</Text>
              <Text style={styles.brandText}>Lenovo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.brandBtn, styles.brandBtnAsus]}
              onPress={() => navigation.navigate("Asus")}
            >
              <Text style={styles.brandIcon}>💻</Text>
              <Text style={styles.brandText}>Asus</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.brandBtn, styles.brandBtnAcer]}
              onPress={() => navigation.navigate("Acer")}
            >
              <Text style={styles.brandIcon}>💻</Text>
              <Text style={styles.brandText}>Acer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.brandBtn, styles.brandBtnMac]}
              onPress={() => navigation.navigate("MacBook")}
            >
              <Text style={styles.brandIcon}>🍎</Text>
              <Text style={styles.brandText}>MacBook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TECHNICIANS */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1581091870627-3f9c1e45b6d1",
          }}
          style={styles.sectionBg}
          imageStyle={{ opacity: 0.2 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👨‍🔧 Expert Technicians</Text>
            <Text style={styles.text}>
              Verified & experienced technicians near you with transparent
              pricing. All technicians are background checked and certified.
            </Text>

            <View style={styles.technicianButtons}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => navigation.navigate("Technicians")}
              >
                <Text style={styles.outlineText}>🔍 View All Technicians</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => navigation.navigate("TechnicianRegistration")}
              >
                <Text style={styles.registerBtnText}>👨‍🔧 Register as Technician</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* ABOUT */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>📖 About FixMyPC</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              FixMyPC is a trusted home-service platform where you can find
              brand-wise computer & laptop repair experts. Choose your brand,
              compare experience & price, and book a certified technician at
              your home.
            </Text>
            <View style={styles.aboutPoints}>
              <Text style={styles.aboutPoint}>✓ 100% Verified Technicians</Text>
              <Text style={styles.aboutPoint}>✓ Same Day Service Available</Text>
              <Text style={styles.aboutPoint}>✓ 90 Days Service Warranty</Text>
              <Text style={styles.aboutPoint}>✓ Transparent Pricing</Text>
            </View>
          </View>
        </View>

        {/* CONTACT */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
          }}
          style={styles.sectionBg}
          imageStyle={{ opacity: 0.2 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📞 Contact Us</Text>
            <View style={styles.contactCard}>
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📞</Text>
                <Text style={styles.contactText}>+91 9876543210</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>📧</Text>
                <Text style={styles.contactText}>support@fixmypc.com</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactIcon}>🕐</Text>
                <Text style={styles.contactText}>Mon-Sat: 9 AM - 8 PM</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <Footer />
      </ScrollView>
    </View>
  );
};

export default Home;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  bgImage: {
    height: 480,
    justifyContent: "center",
  },

  overlay: {
    alignItems: "center",
    padding: 25,
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 8,
    shadowColor: "#007bff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  logoEmoji: {
    fontSize: 40,
  },

  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#007bff",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },

  tagline: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    fontStyle: "italic",
  },

  btnContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },

  btnPrimary: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 30,
    width: "85%",
    marginBottom: 12,
    elevation: 6,
    shadowColor: "#007bff",
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },

  btnPrimaryText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },

  btnSecondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007bff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "75%",
  },

  btnSecondaryText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#007bff",
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#f8f9fa",
  },

  statCard: {
    width: width * 0.45,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: "#007bff",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontWeight: "600",
  },

  featuresSection: {
    padding: 25,
    backgroundColor: "#fff",
  },

  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
  },

  featureCard: {
    width: width * 0.45,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },

  featureIcon: {
    fontSize: 36,
    marginBottom: 10,
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },

  featureDesc: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },

  section: {
    padding: 25,
    alignItems: "center",
  },

  sectionHeader: {
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },

  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },

  sectionBg: {
    width: "100%",
  },

  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    lineHeight: 24,
    marginBottom: 15,
  },

  brandButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 15,
  },

  brandBtn: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 20,
    margin: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: "center",
    width: width * 0.28,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },

  brandBtnHP: { borderColor: "#0096D6" },
  brandBtnDell: { borderColor: "#007DB8" },
  brandBtnLenovo: { borderColor: "#E2231A" },
  brandBtnAsus: { borderColor: "#000000" },
  brandBtnAcer: { borderColor: "#83B81A" },
  brandBtnMac: { borderColor: "#A8A8A8" },

  brandIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  brandText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
  },

  technicianButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 15,
  },
  outlineBtn: {
    borderWidth: 2,
    borderColor: "#007bff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: "#fff",
    minWidth: 180,
  },

  outlineText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007bff",
    textAlign: "center",
  },
  registerBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 180,
    elevation: 4,
    shadowColor: "#28a745",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  registerBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },

  aboutSection: {
    padding: 25,
    backgroundColor: "#f8f9fa",
  },

  aboutCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  aboutText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 20,
    textAlign: "center",
  },

  aboutPoints: {
    alignItems: "flex-start",
  },

  aboutPoint: {
    fontSize: 15,
    color: "#007bff",
    marginBottom: 10,
    fontWeight: "600",
  },

  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    elevation: 4,
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 8,
  },

  contactIcon: {
    fontSize: 24,
    marginRight: 15,
  },

  contactText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});
