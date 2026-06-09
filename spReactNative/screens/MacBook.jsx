import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

const MacBook = () => {
  const navigation = useNavigation();

  const technicians = [
    {
      name: "Amit Sharma",
      experience: "5 Years Apple Certified",
      price: "₹799",
    },
    {
      name: "Rahul Mehta",
      experience: "8 Years Mac Specialist",
      price: "₹999",
    },
    {
      name: "Sandeep Joshi",
      experience: "10+ Years Experience",
      price: "₹1199",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Navbar navigation={navigation} />

      <ScrollView contentContainerStyle={{ backgroundColor: "#f8f9fa" }}>
        {/* 🔥 HERO WITH BG IMAGE */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
          }}
          style={styles.hero}
          imageStyle={{ opacity: 0.35 }}
        >
          <View style={styles.overlay}>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
              }}
              style={styles.logo}
            />
            <Text style={styles.title}>MacBook Repair Service</Text>
            <Text style={styles.subtitle}>
              Premium Apple-Certified Technicians
            </Text>

            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() =>
                navigation.navigate("Booking", { brand: "MacBook" })
              }
            >
              <Text style={styles.heroBtnText}>Book Mac Repair</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* 👨‍🔧 TECHNICIANS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Mac Experts</Text>

          {technicians.map((tech, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.techName}>{tech.name}</Text>
              <Text style={styles.techText}>{tech.experience}</Text>
              <Text style={styles.price}>{tech.price}</Text>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() =>
                  navigation.navigate("Booking", {
                    brand: "MacBook",
                    technician: tech.name,
                  })
                }
              >
                <Text style={styles.bookText}>Book Service</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ⭐ WHY US */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
          }}
          style={styles.infoBg}
          imageStyle={{ opacity: 0.25 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose FixMyPC?</Text>
            <Text style={styles.infoText}>
              ✔ Apple-Certified Professionals{"\n"}
              ✔ Genuine Apple Parts{"\n"}
              ✔ Data Safety Guaranteed{"\n"}
              ✔ Premium Doorstep Support
            </Text>
          </View>
        </ImageBackground>

        <Footer />
      </ScrollView>
    </View>
  );
};

export default MacBook;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  hero: {
    height: 420,
    justifyContent: "center",
  },

  overlay: {
    alignItems: "center",
    padding: 20,
  },

  logo: {
    width: 65,
    height: 65,
    tintColor: "#fff",
    marginBottom: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: "#ddd",
    textAlign: "center",
  },

  heroBtn: {
    marginTop: 25,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
  },

  heroBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 15,
    color: "#000",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    elevation: 6,
  },

  techName: {
    fontSize: 18,
    fontWeight: "800",
  },

  techText: {
    fontSize: 14,
    marginVertical: 6,
    color: "#555",
  },

  price: {
    fontSize: 17,
    fontWeight: "700",
  },

  bookBtn: {
    marginTop: 12,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 12,
  },

  bookText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },

  infoBg: {
    width: "100%",
  },

  infoText: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    color: "#000",
    fontWeight: "600",
  },
});
