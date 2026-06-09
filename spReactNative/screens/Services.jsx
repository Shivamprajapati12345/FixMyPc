import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

const services = [
  {
    icon: "💻",
    name: "Laptop Repair",
    desc: "Screen, keyboard, battery & hardware repair",
    color: "#007bff",
    features: ["Screen Replacement", "Keyboard Fix", "Battery Replacement", "Hardware Repair"],
  },
  {
    icon: "🖥️",
    name: "PC Repair",
    desc: "Desktop troubleshooting & upgrade services",
    color: "#28a745",
    features: ["Troubleshooting", "Component Upgrade", "Performance Boost", "Hardware Fix"],
  },
  {
    icon: "💿",
    name: "OS Installation",
    desc: "Windows / macOS installation & upgrade",
    color: "#ffc107",
    features: ["Windows 10/11", "macOS Setup", "Linux Installation", "Dual Boot"],
  },
  {
    icon: "🛡️",
    name: "Virus Removal",
    desc: "Remove malware, virus & improve speed",
    color: "#dc3545",
    features: ["Malware Removal", "Virus Scan", "System Cleanup", "Speed Optimization"],
  },
  {
    icon: "💾",
    name: "Data Recovery",
    desc: "Recover deleted or corrupted data",
    color: "#6f42c1",
    features: ["File Recovery", "Partition Recovery", "Corrupted Data", "Formatted Drive"],
  },
  {
    icon: "📦",
    name: "Software Support",
    desc: "Office, drivers & software setup",
    color: "#17a2b8",
    features: ["Office Setup", "Driver Installation", "Software Configuration", "System Updates"],
  },
];

const Services = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Navbar navigation={navigation} />

      {/* BACKGROUND */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        }}
        style={styles.bg}
        imageStyle={{ opacity: 0.25 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>🛠️ Our Services</Text>
            <Text style={styles.subtitle}>
              Professional Computer Repair Services at Home
            </Text>
            <View style={styles.headerDivider} />
          </View>

          {services.map((item, index) => (
            <View key={index} style={[styles.card, { borderLeftColor: item.color }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                  <Text style={styles.serviceIcon}>{item.icon}</Text>
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={[styles.cardTitle, { color: item.color }]}>{item.name}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>
                </View>
              </View>

              <View style={styles.featuresContainer}>
                {item.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureTag}>
                    <Text style={styles.featureText}>✓ {feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: item.color }]}
                onPress={() =>
                  navigation.navigate("Booking", {
                    service: item.name,
                  })
                }
              >
                <Text style={styles.btnText}>🚀 Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Footer />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Services;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 50,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    color: "#007bff",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 15,
    fontWeight: "500",
  },

  headerDivider: {
    width: 60,
    height: 4,
    backgroundColor: "#007bff",
    borderRadius: 2,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderLeftWidth: 5,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  serviceIcon: {
    fontSize: 32,
  },

  cardHeaderText: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },

  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  featureTag: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },

  featureText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },

  btn: {
    paddingVertical: 14,
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
});
