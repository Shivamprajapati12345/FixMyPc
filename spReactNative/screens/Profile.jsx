import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirebaseToken, logoutUser } from '../services/firebaseAuth';
import Navbar from '../Navbar.jsx';
import Footer from '../Footer.jsx';
import API_BASE_URL from '../config/api';

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const firebaseToken = await getFirebaseToken();
        const firebaseUid = await AsyncStorage.getItem('firebaseUid');
        const u = await AsyncStorage.getItem('user');
        
        if (!firebaseToken || !firebaseUid || !u) {
          navigation.navigate('Login');
          return;
        }
        
        setToken(firebaseToken);
        
        // Parse user data safely
        try {
          const userData = JSON.parse(u);
          // Ensure user data has required fields
          if (!userData || (!userData.name && !userData.email)) {
            console.error('Invalid user data:', userData);
            navigation.navigate('Login');
            return;
          }
          // Set default values for missing fields
          const completeUserData = {
            name: userData.name || 'User',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            ...userData,
          };
          setUser(completeUserData);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          navigation.navigate('Login');
          return;
        }

        // Load bookings
        try {
          const res = await axios.get(`${API_BASE_URL}/api/bookings`, {
            headers: {
              Authorization: `Bearer ${firebaseToken}`,
              'X-Firebase-UID': firebaseUid,
            }
          });
          setBookings(res.data.bookings || res.data);
        } catch (err) {
          // Silently fail if bookings can't be loaded
          console.log('Failed to load bookings');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        navigation.navigate('Login');
      }
    };
    loadProfile();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      await AsyncStorage.multiRemove(['token', 'user', 'firebaseToken', 'firebaseUid']);
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout fails
      await AsyncStorage.multiRemove(['token', 'user', 'firebaseToken', 'firebaseUid']);
      navigation.replace('Login');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        }}
        style={styles.bg}
        imageStyle={{ opacity: 0.15 }}
      >
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.headerCard}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <Text style={styles.title}>👤 My Profile</Text>
              <Text style={styles.welcomeText}>
                Welcome back, {user.name?.split(' ')[0] || 'User'}! 👋
              </Text>
            </View>

            {/* STATS SECTION */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>📅</Text>
                <Text style={styles.statNumber}>{bookings.length}</Text>
                <Text style={styles.statLabel}>Total Bookings</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>✅</Text>
                <Text style={styles.statNumber}>
                  {bookings.filter(b => b.status === 'Completed').length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⏳</Text>
                <Text style={styles.statNumber}>
                  {bookings.filter(b => b.status === 'Pending' || b.status === 'In Progress').length}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
            </View>

            <View style={styles.profileCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📋 Personal Information</Text>
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Text style={styles.infoIcon}>👤</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Full Name</Text>
                    <Text style={styles.infoValue}>{user.name || 'N/A'}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Text style={styles.infoIcon}>📧</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email Address</Text>
                    <Text style={styles.infoValue}>{user.email || 'N/A'}</Text>
                  </View>
                </View>
                {user.phone && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Text style={styles.infoIcon}>📞</Text>
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Phone Number</Text>
                      <Text style={styles.infoValue}>{user.phone}</Text>
                    </View>
                  </View>
                )}
                {user.address && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Text style={styles.infoIcon}>🏠</Text>
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Address</Text>
                      <Text style={styles.infoValue}>{user.address}</Text>
                    </View>
                  </View>
                )}
                {user.joinDate && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Text style={styles.infoIcon}>📅</Text>
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Member Since</Text>
                      <Text style={styles.infoValue}>{user.joinDate}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.profileCard}>
              <Text style={styles.sectionTitle}>📅 Booking History</Text>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <View key={booking._id || booking.id} style={styles.bookingItem}>
                    <View style={styles.bookingDetails}>
                      <Text style={styles.bookingService}>{booking.service || 'Service'}</Text>
                      {booking.brand && (
                        <Text style={styles.bookingBrand}>Brand: {booking.brand}</Text>
                      )}
                      <Text style={styles.bookingDate}>📅 {booking.date || 'Date not set'}</Text>
                      {booking.problem && (
                        <Text style={styles.bookingProblem} numberOfLines={2}>
                          Issue: {booking.problem}
                        </Text>
                      )}
                    </View>
                    <View style={styles.statusContainer}>
                      <Text
                        style={[
                          styles.statusText,
                          booking.status === 'Completed'
                            ? styles.completed
                            : booking.status === 'Cancelled'
                            ? styles.cancelled
                            : styles.inProgress,
                        ]}
                      >
                        {booking.status || 'Pending'}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noBookings}>
                  <Text style={styles.noBookingsText}>No bookings yet</Text>
                  <TouchableOpacity
                    style={styles.bookNowBtn}
                    onPress={() => navigation.navigate('Booking')}
                  >
                    <Text style={styles.bookNowText}>Book Your First Service</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Footer />
      </ImageBackground>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bg: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  headerCard: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#007bff',
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#007bff',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 17,
    color: '#fff',
    opacity: 0.95,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#007bff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#007bff',
    marginBottom: 18,
  },
  infoContainer: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'flex-start',
  },
  infoIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    lineHeight: 22,
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  bookingDetails: {
    flex: 1,
    marginRight: 10,
  },
  bookingService: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  bookingBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingProblem: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  completed: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  inProgress: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  cancelled: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  noBookings: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noBookingsText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 15,
  },
  bookNowBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  bookNowText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    elevation: 4,
    shadowColor: '#dc3545',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
  },
});
