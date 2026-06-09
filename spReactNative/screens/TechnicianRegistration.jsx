import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import API_BASE_URL from "../config/api";

const TechnicianRegistration = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    specialization: "",
    brands: "",
    price: "",
    location: "",
    bio: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.experience ||
      !formData.brands ||
      !formData.price
    ) {
      Alert.alert("Error", "Please fill all required fields (*)");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Validate phone (should be 10 digits)
    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    // Validate experience (should be a number)
    const experience = parseInt(formData.experience);
    if (isNaN(experience) || experience < 0) {
      Alert.alert("Error", "Please enter a valid experience (in years)");
      return;
    }

    // Validate price (should be a number)
    const price = parseInt(formData.price);
    if (isNaN(price) || price < 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      // Prepare data for backend
      const technicianData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        experience: experience,
        specialization: formData.specialization
          ? formData.specialization.split(",").map((s) => s.trim())
          : [],
        brands: formData.brands.split(",").map((b) => b.trim()),
        price: price,
        location: formData.location.trim() || "",
        bio: formData.bio.trim() || "",
        isAvailable: true,
        rating: 0,
        totalReviews: 0,
      };

      // Send to backend
      const response = await axios.post(
        `${API_BASE_URL}/api/technicians/register`,
        technicianData
      );

      if (response.data && response.data.technician) {
        Alert.alert(
          "Success! 🎉",
          "Your technician registration is successful!\n\nYou will be verified and added to our platform soon.",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset form
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  experience: "",
                  specialization: "",
                  brands: "",
                  price: "",
                  location: "",
                  bio: "",
                });
                navigation.navigate("Home");
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Technician registration error:", error);
      let errorMessage = "Registration failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (errorMessage.includes("email") || errorMessage.includes("Email")) {
        errorMessage = "This email is already registered. Please use a different email.";
      }

      Alert.alert("Registration Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.headerSection}>
              <Text style={styles.headerIcon}>👨‍🔧</Text>
              <Text style={styles.title}>Technician Registration</Text>
              <Text style={styles.subtitle}>
                Join our platform and start earning
              </Text>
            </View>

            <View style={styles.formSection}>
              {/* NAME */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Full Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                />
              </View>

              {/* EMAIL */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Email Address <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                />
              </View>

              {/* PHONE */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Phone Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit mobile number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                />
              </View>

              {/* EXPERIENCE */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Years of Experience <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 5"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={formData.experience}
                  onChangeText={(value) => handleInputChange("experience", value)}
                />
              </View>

              {/* SPECIALIZATION */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Specialization</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Laptop Repair, OS Installation (comma separated)"
                  placeholderTextColor="#999"
                  value={formData.specialization}
                  onChangeText={(value) => handleInputChange("specialization", value)}
                />
              </View>

              {/* BRANDS */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Brands You Service <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. HP, Dell, Lenovo (comma separated)"
                  placeholderTextColor="#999"
                  value={formData.brands}
                  onChangeText={(value) => handleInputChange("brands", value)}
                />
                <Text style={styles.hint}>
                  Enter brand names separated by commas
                </Text>
              </View>

              {/* PRICE */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Service Price (₹) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 500"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={(value) => handleInputChange("price", value)}
                />
                <Text style={styles.hint}>Base price for your services</Text>
              </View>

              {/* LOCATION */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City, State"
                  placeholderTextColor="#999"
                  value={formData.location}
                  onChangeText={(value) => handleInputChange("location", value)}
                />
              </View>

              {/* BIO */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bio / Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell us about yourself and your expertise..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  value={formData.bio}
                  onChangeText={(value) => handleInputChange("bio", value)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Register as Technician</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.note}>
              💡 After registration, your profile will be reviewed and verified. You'll be notified once approved.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Footer />
    </View>
  );
};

export default TechnicianRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
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
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#f0f0f0",
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
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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
  required: {
    color: "#dc3545",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#e9ecef",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    fontStyle: "italic",
  },
  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  note: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
    lineHeight: 20,
  },
});
