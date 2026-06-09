import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

const Lenovo = () => {
  const navigation = useNavigation();

  const technicians = [
    {
      name: "Vikas Singh",
      experience: "5 Years Experience",
      price: "₹449",
    },
    {
      name: "Rohit Yadav",
      experience: "7 Years Experience",
      price: "₹549",
    },
    {
      name: "Ankit Patel",
      experience: "3 Years Experience",
      price: "₹349",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Navbar navigation={navigation} />

      <ScrollView contentContainerStyle={{ backgroundColor: "#f8f9fa" }}>
        {/* HEADER */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
          }}
          style={styles.headerBg}
          imageStyle={{ opacity: 0.35 }}
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.title}>Lenovo Laptop Repair</Text>
            <Text style={styles.subtitle}>
              Trusted Lenovo Technicians at Your Home
            </Text>
          </View>
        </ImageBackground>

        {/* TECHNICIANS LIST */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Technicians</Text>

          {technicians.map((tech, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.techName}>{tech.name}</Text>
              <Text style={styles.techText}>{tech.experience}</Text>
              <Text style={styles.price}>{tech.price}</Text>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() =>
                  navigation.navigate("Booking", {
                    brand: "Lenovo",
                    technician: tech.name,
                  })
                }
              >
                <Text style={styles.bookText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* WHY LENOVO SERVICE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose FixMyPC?</Text>
          <Text style={styles.text}>
            ✔ Lenovo-certified technicians{"\n"}
            ✔ Original spare parts{"\n"}
            ✔ Affordable pricing{"\n"}
            ✔ Doorstep service
          </Text>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
};

export default Lenovo;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  headerBg: {
    height: 280,
    justifyContent: "center",
  },

  headerOverlay: {
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#000",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 10,
    color: "#000",
    textAlign: "center",
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 15,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
  },

  techName: {
    fontSize: 18,
    fontWeight: "800",
  },

  techText: {
    fontSize: 14,
    marginVertical: 4,
    opacity: 0.8,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007bff",
    marginVertical: 5,
  },

  bookBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  bookText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    opacity: 0.9,
  },
});
