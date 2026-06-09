import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

const techniciansData = [
  {
    name: "Rahul Sharma",
    experience: "5 Years Experience",
    rating: "⭐⭐⭐⭐⭐",
    brand: "HP",
  },
  {
    name: "Amit Verma",
    experience: "4 Years Experience",
    rating: "⭐⭐⭐⭐",
    brand: "Dell",
  },
  {
    name: "Suresh Kumar",
    experience: "6 Years Experience",
    rating: "⭐⭐⭐⭐⭐",
    brand: "Lenovo",
  },
  {
    name: "Neeraj Singh",
    experience: "3 Years Experience",
    rating: "⭐⭐⭐⭐",
    brand: "Asus",
  },
  {
    name: "Mohit Jain",
    experience: "7 Years Experience",
    rating: "⭐⭐⭐⭐⭐",
    brand: "Acer",
  },
  {
    name: "Rohit Mehta",
    experience: "5 Years Experience",
    rating: "⭐⭐⭐⭐⭐",
    brand: "MacBook",
  },
];

const Technicians = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedBrand = route.params?.brand;

  const filteredTechs = selectedBrand
    ? techniciansData.filter((t) => t.brand === selectedBrand)
    : techniciansData;

  return (
    <View style={{ flex: 1 }}>
      <Navbar navigation={navigation} />

      {/* BACKGROUND IMAGE */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1581091870627-3f9c1e45b6d1",
        }}
        style={styles.bg}
        imageStyle={{ opacity: 0.25 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>
            {selectedBrand ? `${selectedBrand} Technicians` : "Our Technicians"}
          </Text>

          <Text style={styles.subtitle}>
            Verified & Experienced Professionals
          </Text>

          {filteredTechs.map((tech, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.name}>{tech.name}</Text>
              <Text style={styles.text}>{tech.experience}</Text>
              <Text style={styles.text}>Brand: {tech.brand}</Text>
              <Text style={styles.rating}>{tech.rating}</Text>

              <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                  navigation.navigate("Booking", {
                    service: `${tech.brand} Repair`,
                    brand: tech.brand,
                    technician: tech.name,
                  })
                }
              >
                <Text style={styles.btnText}>Book Technician</Text>
              </TouchableOpacity>
            </View>
          ))}

          {filteredTechs.length === 0 && (
            <Text style={styles.noData}>
              No technicians available for this brand
            </Text>
          )}

          <Footer />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Technicians;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: "#f8f9fa",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    color: "#000",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#ffffffee",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#007bff",
    marginBottom: 4,
  },

  text: {
    fontSize: 15,
    color: "#444",
    marginBottom: 3,
  },

  rating: {
    fontSize: 16,
    marginVertical: 6,
  },

  btn: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },

  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
});
