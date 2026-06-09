import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import { createRepairRequest } from "./apiSmartRequest";

const SmartRepairRequest = () => {
  const navigation = useNavigation();
  const [deviceType, setDeviceType] = useState("laptop");
  const [issueDescription, setIssueDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!issueDescription) {
      Alert.alert("Error", "Please describe the issue");
      return;
    }
    setLoading(true);
    Geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const repairRequest = await createRepairRequest({
            deviceType,
            issueDescription,
            lat: coords.latitude,
            lng: coords.longitude,
          });
          navigation.navigate("SmartQuotations", { repairRequest });
        } catch (e) {
          console.log(e);
          Alert.alert("Error", "Could not create repair request");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.log(err);
        Alert.alert("Location", "Permission denied or unavailable");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Smart Repair Request</Text>
          <TextInput
            style={styles.input}
            value={deviceType}
            onChangeText={setDeviceType}
            placeholder="Device type (laptop / desktop)"
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={issueDescription}
            onChangeText={setIssueDescription}
            placeholder="Describe the issue"
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Find Nearby Technicians</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </View>
  );
};

export default SmartRepairRequest;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
    color: "#111827",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  button: {
    marginTop: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

