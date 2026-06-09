import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirebaseToken } from "../services/firebaseAuth";
import { initiatePayment } from "../services/razorpay";
import API_BASE_URL from "../config/api";

import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

const Booking = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const selectedService = route.params?.service || "";
  const selectedBrand = route.params?.brand || "";
  const selectedTechnician = route.params?.technician || "";

  const [firebaseToken, setFirebaseToken] = useState("");
  const [firebaseUid, setFirebaseUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [bookingAmount, setBookingAmount] = useState(0);

  const [service, setService] = useState(selectedService);
  const [brand, setBrand] = useState(selectedBrand);
  const [technician, setTechnician] = useState(selectedTechnician);
  const [problem, setProblem] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // Service pricing
  const servicePrices = {
    "Laptop Repair": 499,
    "PC Repair": 599,
    "OS Installation": 399,
    "Virus Removal": 299,
    "Data Recovery": 799,
    "Software Support": 249,
  };

  useEffect(() => {
    const init = async () => {
      try {
        const token = await getFirebaseToken();
        const uid = await AsyncStorage.getItem("firebaseUid");
        setFirebaseToken(token || "");
        setFirebaseUid(uid || "");
        
        // Calculate amount based on service
        if (selectedService && servicePrices[selectedService]) {
          setBookingAmount(servicePrices[selectedService]);
        } else {
          setBookingAmount(499); // Default price
        }
      } catch (error) {
        console.error('Error initializing booking:', error);
        // Still set default price even if token fetch fails
        if (selectedService && servicePrices[selectedService]) {
          setBookingAmount(servicePrices[selectedService]);
        } else {
          setBookingAmount(499);
        }
      }
    };
    init();
  }, [selectedService]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onDateConfirm = (date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const onDateCancel = () => {
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    const dateString = formatDate(selectedDate);
    if (!service || !dateString || !problem || !address || !phone) {
      Alert.alert("Error", "Please fill all required details");
      return;
    }

    // Calculate amount based on service
    const amount = servicePrices[service] || 499;
    setBookingAmount(amount);

    // If we are in demo mode (no real Firebase token), try to save booking with email
    if (!firebaseToken || firebaseToken === "demo-token" || !firebaseUid) {
      try {
        const userData = await AsyncStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        const userEmail = user?.email || "";

        // Try to save booking to backend with email
        try {
          await axios.post(
            `${API_BASE_URL}/api/bookings`,
            {
              service,
              brand,
              technician,
              problem,
              date: dateString,
              address,
              phone,
              email: userEmail,
            }
          );
        } catch (err) {
          console.log("Backend booking save failed, continuing with mock payment");
        }
      } catch (err) {
        console.log("Error getting user email");
      }

      resetForm();
      navigation.navigate("MockPayment", {
        bookingId: null,
        amount: amount,
        service: service,
        brand: brand || "",
        technician: technician || "",
      });
      return;
    }

    setLoading(true);
    try {
      // Get user email from AsyncStorage
      const userData = await AsyncStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const userEmail = user?.email || "";

      // Create booking first
      const bookingResponse = await axios.post(
        `${API_BASE_URL}/api/bookings`,
        {
          service,
          brand,
          technician,
          problem,
          date: dateString,
          address,
          phone,
          email: userEmail, // Send email for profile linking
        },
        {
          headers: {
            Authorization: `Bearer ${firebaseToken}`,
            "X-Firebase-UID": firebaseUid,
          },
        }
      );

      const booking = bookingResponse.data.booking;
      setBookingId(booking._id || booking.id);
      
      // Calculate amount
      const amount = servicePrices[service] || 499;
      setBookingAmount(amount);

      // Navigate to mock payment screen
      navigation.navigate("MockPayment", {
        bookingId: booking._id || booking.id,
        amount: amount,
        service: service,
        brand: brand || "",
        technician: technician || "",
      });
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId, amount) => {
    setLoading(true);
    try {
      const result = await initiatePayment(
        amount,
        bookingId,
        `Payment for ${service} - ${brand || "General"}`
      );

      if (result.success) {
        Alert.alert(
          "Payment Successful! 🎉",
          `Your payment of ₹${amount} has been processed successfully. Your booking is confirmed!`,
          [
            {
              text: "OK",
              onPress: () => {
                resetForm();
                navigation.navigate("Profile");
              },
            },
          ]
        );
      } else if (result.cancelled) {
        Alert.alert("Payment Cancelled", "You can pay later from your profile.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Payment Error",
        error.message || "Failed to process payment. You can try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setService("");
    setBrand("");
    setTechnician("");
    setProblem("");
    setSelectedDate(new Date());
    setAddress("");
    setPhone("");
    setBookingId(null);
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.card}>
            <View style={styles.headerSection}>
              <View style={styles.iconCircle}>
                <Text style={styles.headerIcon}>📋</Text>
              </View>
              <Text style={styles.title}>Book a Repair</Text>
              <Text style={styles.subtitle}>
                Fill in the details below to book your doorstep service
              </Text>
            </View>

            <View style={styles.formSection}>
              {/* SERVICE */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>🛠️ Service Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Screen Repair, OS Install, Virus Removal"
                  placeholderTextColor="#999"
                  value={service}
                  onChangeText={setService}
                />
              </View>

              {/* BRAND */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>💻 Device Brand</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HP / Dell / Lenovo / Asus / Acer / MacBook"
                  placeholderTextColor="#999"
                  value={brand}
                  onChangeText={setBrand}
                />
              </View>

              {/* TECHNICIAN */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>👨‍🔧 Preferred Technician (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Leave blank for any available technician"
                  placeholderTextColor="#999"
                  value={technician}
                  onChangeText={setTechnician}
                />
              </View>

              {/* PROBLEM */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>❓ Problem Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your problem in detail (e.g. Laptop not starting, screen is black, overheating...)"
                  placeholderTextColor="#999"
                  value={problem}
                  onChangeText={setProblem}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* DATE */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>📅 Preferred Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDate(selectedDate)}
                  </Text>
                  <Text style={styles.dateButtonIcon}>📅</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="date"
                  onConfirm={onDateConfirm}
                  onCancel={onDateCancel}
                  minimumDate={new Date()}
                />
              </View>

              {/* PHONE */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>📞 Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your 10-digit mobile number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={10}
                />
              </View>

              {/* ADDRESS */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>🏠 Complete Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="House No, Street, Area, City, Pincode"
                  placeholderTextColor="#999"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* PRICE DISPLAY */}
            {service && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Estimated Price</Text>
                <Text style={styles.priceAmount}>
                  ₹{servicePrices[service] || 499}
                </Text>
                <Text style={styles.priceNote}>
                  * Final price may vary based on actual service required
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>✅ Confirm Booking</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.note}>
              💡 Our technician will contact you within 24 hours to confirm the appointment
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      <Footer />
    </View>
  );
};

export default Booking;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scroll: {
    paddingVertical: 25,
    alignItems: "center",
  },
  card: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#f0f0f0",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
  },
  formSection: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#e9ecef",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  dateButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e9ecef",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  dateButtonIcon: {
    fontSize: 20,
  },
  btn: {
    backgroundColor: "#007bff",
    paddingVertical: 18,
    borderRadius: 18,
    marginTop: 15,
    shadowColor: "#007bff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 19,
    fontWeight: "800",
  },
  note: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic",
    lineHeight: 20,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  priceContainer: {
    backgroundColor: "#f0f7ff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#007bff",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginBottom: 5,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: "900",
    color: "#007bff",
    marginBottom: 5,
  },
  priceNote: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
});
