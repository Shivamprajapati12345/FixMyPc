import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

const OrderConfirmation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    service,
    brand,
    technician,
    etaMinutes = 10,
  } = route.params || {};

  const companyName = brand || "your device";
  const technicianName = technician || "our technician";

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.emoji}>✅</Text>
          <Text style={styles.title}>Your order is confirmed!</Text>

          <Text style={styles.message}>
            Thank you for booking with <Text style={styles.highlight}>TechNation</Text>.
          </Text>

          <Text style={styles.message}>
            {technicianName} for{" "}
            <Text style={styles.highlight}>{companyName}</Text>{" "}
            will arrive in{" "}
            <Text style={styles.highlight}>{etaMinutes} minutes</Text>.
          </Text>

          {service ? (
            <Text style={styles.secondary}>
              Service: <Text style={styles.highlight}>{service}</Text>
            </Text>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer />
    </View>
  );
};

export default OrderConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "95%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  emoji: {
    fontSize: 46,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },
  secondary: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  highlight: {
    fontWeight: "700",
    color: "#2563EB",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 999,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

