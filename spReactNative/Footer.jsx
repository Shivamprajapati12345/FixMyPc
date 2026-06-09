import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2024 FixMyPC. All rights reserved.</Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});