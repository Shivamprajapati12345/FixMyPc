import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./screens/Home.jsx";
import Services from "./screens/Services.jsx";
import Booking from "./screens/Booking.jsx";
import Profile from "./screens/Profile.jsx";
import Login from "./screens/Login.jsx";
import HP from "./screens/HP.jsx";
import Dell from "./screens/Dell.jsx";
import Technicians from "./screens/Technicians.jsx";
import Lenovo from "./screens/Lenovo.jsx";
import Asus from "./screens/Asus.jsx";
import Acer from "./screens/Acer.jsx";
import MacBook from "./screens/MacBook.jsx";
import OrderConfirmation from "./screens/OrderConfirmation.jsx";
import MockPayment from "./screens/MockPayment.jsx";
import TechnicianRegistration from "./screens/TechnicianRegistration.jsx";
import SmartRepairRequest from "./screens/SmartRepairRequest.jsx";
import SmartQuotations from "./screens/SmartQuotations.jsx";

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('App component rendered');
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Services" component={Services} />
            <Stack.Screen name="Booking" component={Booking} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="HP" component={HP} />
            <Stack.Screen name="Dell" component={Dell} />
            <Stack.Screen name="Technicians" component={Technicians} />
            <Stack.Screen name="Lenovo" component={Lenovo} />
            <Stack.Screen name="Asus" component={Asus} />
            <Stack.Screen name="Acer" component={Acer} />
            <Stack.Screen name="MacBook" component={MacBook} />
            <Stack.Screen name="MockPayment" component={MockPayment} />
            <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
            <Stack.Screen name="TechnicianRegistration" component={TechnicianRegistration} />
            <Stack.Screen name="SmartRepairRequest" component={SmartRepairRequest} />
            <Stack.Screen name="SmartQuotations" component={SmartQuotations} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff", // background for iPhone notch area
  },
});
