import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

const HP = () => {
  const navigation = useNavigation();

  const technicians = [
    {
      name: "Rahul Sharma",
      exp: "5 Years Experience",
      price: "₹499",
    },
    {
      name: "Amit Verma",
      exp: "3 Years Experience",
      price: "₹399",
    },
    {
      name: "Suresh Kumar",
      exp: "7 Years Experience",
      price: "₹699",
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
          <View style={styles.overlay}>
            <Text style={styles.title}>HP Laptop Repair</Text>
            <Text style={styles.subtitle}>
              Certified HP Technicians Near You
            </Text>
          </View>
        </ImageBackground>

        {/* TECHNICIANS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available HP Experts</Text>

          {technicians.map((tech, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.name}>{tech.name}</Text>
              <Text style={styles.exp}>{tech.exp}</Text>
              <Text style={styles.price}>{tech.price}</Text>

              <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                  navigation.navigate("Booking", {
                    brand: "HP",
                    technician: tech.name,
                  })
                }
              >
                <Text style={styles.btnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* WHY HP SERVICE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose FixMyPC?</Text>
          <Text style={styles.text}>
            ✔ HP-certified technicians{"\n"}
            ✔ Genuine spare parts{"\n"}
            ✔ Transparent pricing{"\n"}
            ✔ Home service available
          </Text>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
};

export default HP;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  headerBg: {
    height: 280,
    justifyContent: "center",
  },

  overlay: {
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

  name: {
    fontSize: 18,
    fontWeight: "800",
  },

  exp: {
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

  btn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  btnText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    opacity: 0.9,
  },
});
