import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser, loginUser, resetPassword } from "../services/firebaseAuth";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

const Login = () => {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(false); // Start with register form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // Login with Firebase
        const result = await loginUser(email, password);
        if (result && result.success) {
          Alert.alert("Success", "Logged in successfully! 🔥");
          navigation.replace("Home");
        } else {
          Alert.alert("Error", "Login failed. Please try again.");
        }
      } else {
        // Register with Firebase
        const result = await registerUser(name, email, password, phone, address);
        if (result && result.success) {
          Alert.alert("Success", "Registered successfully! 🎉\n\nNow please login with your credentials.", [
            {
              text: "OK",
              onPress: () => {
                setIsLogin(true); // Switch to login form after registration
              },
            },
          ]);
        } else {
          Alert.alert("Error", "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      let errorMessage = "Something went wrong";
      
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email is already registered";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "User not found. Please register first";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert("Success", "Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to send reset email");
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        }}
        style={styles.bg}
        imageStyle={{ opacity: 0.2 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={styles.title}>
                {isLogin ? "Welcome Back" : "Create Account"}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin
                  ? "Login to book your repair service"
                  : "Sign up to get started"}
              </Text>

              {!isLogin && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name *"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number (Optional)"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Address (Optional)"
                    placeholderTextColor="#999"
                    value={address}
                    onChangeText={setAddress}
                  />
                </>
              )}

              <TextInput
                style={styles.input}
                placeholder="Email *"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Password *"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              {isLogin && (
                <TouchableOpacity
                  style={styles.forgotPasswordBtn}
                  onPress={() => setShowForgotPassword(true)}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              {showForgotPassword && (
                <View style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordTitle}>Reset Password</Text>
                  <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={handleForgotPassword}
                  >
                    <Text style={styles.resetBtnText}>Send Reset Email</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowForgotPassword(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
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
                  <Text style={styles.btnText}>
                    {isLogin ? "🔥 Login with Firebase" : "✨ Register with Firebase"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchBtn}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.switch}>
                  {isLogin
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Footer />
      </ImageBackground>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  bg: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 80,
  },
  card: {
    backgroundColor: "#ffffffee",
    borderRadius: 20,
    padding: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    color: "#333",
  },
  btn: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    elevation: 4,
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  switchBtn: {
    marginTop: 20,
    paddingVertical: 10,
  },
  switch: {
    textAlign: "center",
    color: "#007bff",
    fontSize: 15,
    fontWeight: "600",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  forgotPasswordBtn: {
    alignSelf: "flex-end",
    marginTop: -10,
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "600",
  },
  forgotPasswordContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  forgotPasswordTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  resetBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  resetBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  cancelText: {
    color: "#dc3545",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
});
