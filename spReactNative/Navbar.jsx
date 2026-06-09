// Navbar.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, logoutUser } from './services/firebaseAuth';

const Navbar = () => {
  const navigation = useNavigation();

  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };
    checkUser();
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginButtonPress = () => {
    setShowLogin(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      await AsyncStorage.multiRemove(['user', 'firebaseToken', 'firebaseUid']);
      setUser(null);
      setEmail('');
      setPassword('');
      Alert.alert('Success', 'Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if logout fails
      await AsyncStorage.multiRemove(['user', 'firebaseToken', 'firebaseUid']);
      setUser(null);
      setEmail('');
      setPassword('');
    }
  };

  const handleSubmitLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email aur password bharo');
      return;
    }

    try {
      const result = await loginUser(email.trim(), password.trim());
      if (result && result.success) {
        setUser(result.user);
        setShowLogin(false);
        Alert.alert('Success', 'Login ho gaya');
        // Refresh user from AsyncStorage
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } else {
        Alert.alert('Login Error', 'Login failed, please try again');
      }
    } catch (error) {
      Alert.alert('Login Error', error.message || 'Kuch galat ho gaya');
    }
  };

  return (
    <View>
      <View style={styles.navbar}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.hamburger}
            onPress={() => setIsMenuOpen((prev) => !prev)}
          >
            <Text style={styles.hamburgerText}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>FixMyPc</Text>
        </View>

        <View style={styles.rightSection}>
          {user ? (
            <TouchableOpacity style={styles.buttonSecondary} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={handleLoginButtonPress}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isMenuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={() => {
              setIsMenuOpen(false);
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.menuItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsMenuOpen(false);
              navigation.navigate('Services');
            }}
          >
            <Text style={styles.menuItem}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsMenuOpen(false);
              navigation.navigate('Booking');
            }}
          >
            <Text style={styles.menuItem}>Book</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsMenuOpen(false);
              navigation.navigate('Profile');
            }}
          >
            <Text style={styles.menuItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsMenuOpen(false);
              navigation.navigate('TechnicianRegistration');
            }}
          >
            <Text style={styles.menuItem}>👨‍🔧 Register as Technician</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showLogin}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogin(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={handleSubmitLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setShowLogin(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburger: {
    marginRight: 12,
    padding: 4,
  },
  hamburgerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonSecondary: {
    backgroundColor: '#4B5563',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  bookingCard: {
    marginTop: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#166534',
  },
  bookingText: {
    fontSize: 14,
    color: '#14532D',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  menu: {
    backgroundColor: '#1F2937',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuItem: {
    color: '#E5E7EB',
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Navbar;