import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirebaseToken } from "../services/firebaseAuth";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import API_BASE_URL from "../config/api";

const MockPayment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { bookingId, amount, service, brand, technician } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleMockPayment = async () => {
    setLoading(true);
    try {
      const firebaseToken = await getFirebaseToken();
      const firebaseUid = await AsyncStorage.getItem("firebaseUid");
      const userData = await AsyncStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      // Save mock payment to MongoDB
      const paymentData = {
        bookingId,
        amount,
        paymentMethod: "mock",
        status: "completed",
        transactionId: `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        service,
        brand,
        technician,
        userEmail: user?.email || "",
      };

      // Call backend to save payment
      try {
        await axios.post(
          `${API_BASE_URL}/api/payments/mock-payment`,
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${firebaseToken || "demo-token"}`,
              "X-Firebase-UID": firebaseUid || "",
            },
          }
        );
      } catch (err) {
        console.log("Backend payment save failed, continuing with mock payment");
      }

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        "Payment Successful! 🎉",
        `Your payment of ₹${amount} has been processed successfully.\n\nTransaction ID: ${paymentData.transactionId}`,
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("OrderConfirmation", {
                service,
                brand,
                technician,
                etaMinutes: 10,
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Mock payment error:", error);
      Alert.alert("Error", "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.headerSection}>
            <Text style={styles.headerIcon}>💳</Text>
            <Text style={styles.title}>Mock Payment</Text>
            <Text style={styles.subtitle}>Complete your booking payment</Text>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>₹{amount || 0}</Text>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service:</Text>
              <Text style={styles.detailValue}>{service || "N/A"}</Text>
            </View>
            {brand && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Brand:</Text>
                <Text style={styles.detailValue}>{brand}</Text>
              </View>
            )}
            {technician && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Technician:</Text>
                <Text style={styles.detailValue}>{technician}</Text>
              </View>
            )}
          </View>

          <View style={styles.paymentMethodSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity
              style={[
                styles.methodCard,
                paymentMethod === "card" && styles.methodCardSelected,
              ]}
              onPress={() => setPaymentMethod("card")}
            >
              <Text style={styles.methodIcon}>💳</Text>
              <Text style={styles.methodText}>Credit/Debit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.methodCard,
                paymentMethod === "upi" && styles.methodCardSelected,
              ]}
              onPress={() => setPaymentMethod("upi")}
            >
              <Text style={styles.methodIcon}>📱</Text>
              <Text style={styles.methodText}>UPI</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.methodCard,
                paymentMethod === "wallet" && styles.methodCardSelected,
              ]}
              onPress={() => setPaymentMethod("wallet")}
            >
              <Text style={styles.methodIcon}>💰</Text>
              <Text style={styles.methodText}>Wallet</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handleMockPayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Pay ₹{amount || 0}</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.note}>
            ⚠️ This is a mock payment. No real money will be charged.
          </Text>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default MockPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scroll: {
    padding: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#007bff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  amountSection: {
    backgroundColor: "#f0f7ff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#007bff",
  },
  detailsSection: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "700",
  },
  paymentMethodSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  methodCardSelected: {
    borderColor: "#007bff",
    backgroundColor: "#f0f7ff",
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  payButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  note: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
});
