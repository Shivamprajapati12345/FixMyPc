import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { io } from "socket.io-client";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import API_BASE_URL from "../config/api";
import { getQuotationsByRequest } from "./apiSmartRequest";

// Socket.io server: convert API_BASE_URL (http://10.0.2.2:5001) to ws base
const SOCKET_URL = API_BASE_URL; // same host/port
const socket = io(SOCKET_URL, { autoConnect: false });

const SmartQuotations = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { repairRequest } = route.params;
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const initial = await getQuotationsByRequest(repairRequest._id);
        setQuotations(initial);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [repairRequest._id]);

  useEffect(() => {
    socket.auth = { userId: "user", role: "user" };
    socket.connect();
    socket.emit("joinRequestRoom", repairRequest._id);

    socket.on("newQuotation", (q) => {
      setQuotations((prev) => {
        const idx = prev.findIndex((x) => x._id === q._id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = q;
          return clone;
        }
        return [...prev, q];
      });
    });

    return () => {
      socket.off("newQuotation");
      socket.disconnect();
    };
  }, [repairRequest._id]);

  const lowestPrice = useMemo(
    () => (quotations.length ? Math.min(...quotations.map((q) => q.price)) : null),
    [quotations]
  );

  const renderItem = ({ item }) => {
    const isLowest = lowestPrice !== null && item.price === lowestPrice;
    return (
      <View style={[styles.card, isLowest && styles.lowestCard]}>
        <Text style={styles.techName}>{item.technician?.name || "Technician"}</Text>
        <Text>Price: ₹{item.price}</Text>
        {item.etaHours ? <Text>ETA: {item.etaHours} hours</Text> : null}
        {item.message ? <Text>Note: {item.message}</Text> : null}
        {isLowest && <Text style={styles.lowestText}>LOWEST PRICE</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.title}>Quotations</Text>
        {!quotations.length && <Text>Waiting for technicians to respond…</Text>}
        <FlatList
          data={quotations}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
      <Footer />
    </View>
  );
};

export default SmartQuotations;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  lowestCard: {
    borderColor: "#00c853",
    backgroundColor: "#e8f5e9",
    elevation: 4,
  },
  techName: { fontWeight: "bold", marginBottom: 4 },
  lowestText: { marginTop: 4, color: "#00c853", fontWeight: "bold" },
});

