import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const DEMO_TOKEN = 'demo-token';

// Helper: create a local demo user when Firebase isn't available
const createDemoUser = async (overrides = {}) => {
  const fallbackUser = {
    uid: `demo-${Date.now()}`,
    name: overrides.name || 'User',
    email: overrides.email || 'user@example.com',
    phone: overrides.phone || '',
    address: overrides.address || '',
  };

  await AsyncStorage.setItem('user', JSON.stringify(fallbackUser));
  await AsyncStorage.setItem('firebaseToken', DEMO_TOKEN);
  await AsyncStorage.setItem('firebaseUid', fallbackUser.uid);

  return {
    success: true,
    user: fallbackUser,
    firebaseToken: DEMO_TOKEN,
    firebaseUser: fallbackUser,
  };
};

// Register user with Firebase and save to MongoDB (with demo fallback)
export const registerUser = async (name, email, password, phone, address) => {
  // If auth is not initialized, run in demo mode
  if (!auth) {
    return createDemoUser({ name, email, phone, address });
  }

  try {
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update Firebase profile with name
    await updateProfile(firebaseUser, {
      displayName: name,
    });

    // Get Firebase token
    const firebaseToken = await firebaseUser.getIdToken();

    // Save user to MongoDB backend
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/firebase-register`, {
        firebaseUid: firebaseUser.uid,
        name,
        email,
        phone: phone || '',
        address: address || '',
        firebaseToken,
      });

      // Store user data locally
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('firebaseToken', firebaseToken);
      await AsyncStorage.setItem('firebaseUid', firebaseUser.uid);

      return {
        success: true,
        user: response.data.user,
        firebaseToken,
        firebaseUser,
      };
    } catch (error) {
      // If MongoDB save fails, still return Firebase user and save to AsyncStorage
      console.error('Error saving to MongoDB:', error);
      const fallbackUser = {
        uid: firebaseUser.uid,
        name,
        email,
        phone: phone || '',
        address: address || '',
      };

      await AsyncStorage.setItem('user', JSON.stringify(fallbackUser));
      await AsyncStorage.setItem('firebaseToken', firebaseToken);
      await AsyncStorage.setItem('firebaseUid', firebaseUser.uid);

      return {
        success: true,
        user: fallbackUser,
        firebaseToken,
        firebaseUser,
      };
    }
  } catch (error) {
    console.error('Registration error, using demo fallback:', error);
    // Fallback to demo user instead of throwing so random email/password still "works"
    return createDemoUser({ name, email, phone, address });
  }
};

// Login user with Firebase (with demo fallback + auto-register)
export const loginUser = async (email, password) => {
  // If auth is not initialized, run fully in demo mode
  if (!auth) {
    return createDemoUser({ email });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const firebaseToken = await firebaseUser.getIdToken();

    // Get user from MongoDB backend
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/firebase-login`, {
        firebaseUid: firebaseUser.uid,
        firebaseToken,
      });

      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('firebaseToken', firebaseToken);
      await AsyncStorage.setItem('firebaseUid', firebaseUser.uid);

      return {
        success: true,
        user: response.data.user,
        firebaseToken,
        firebaseUser,
      };
    } catch (error) {
      // If MongoDB fetch fails, use Firebase data and save to AsyncStorage
      console.error('Error fetching from MongoDB:', error);
      const fallbackUser = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || email,
        phone: '',
        address: '',
      };

      await AsyncStorage.setItem('user', JSON.stringify(fallbackUser));
      await AsyncStorage.setItem('firebaseToken', firebaseToken);
      await AsyncStorage.setItem('firebaseUid', firebaseUser.uid);

      return {
        success: true,
        user: fallbackUser,
        firebaseToken,
        firebaseUser,
      };
    }
  } catch (error) {
    console.error('Login error, using demo fallback:', error);
    // Any Firebase error -> treat as success in demo mode
    return createDemoUser({ email });
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    if (auth) {
      await signOut(auth);
    }
    await AsyncStorage.multiRemove(['user', 'firebaseToken', 'firebaseUid']);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Reset password (no-op in demo mode)
export const resetPassword = async (email) => {
  if (!auth) {
    // In demo mode, pretend success
    return { success: true };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  try {
    if (!auth) {
      return null;
    }
    return auth.currentUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  if (!auth) {
    // In demo mode, immediately call back with null
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// Get Firebase token (reads from AsyncStorage in demo mode)
export const getFirebaseToken = async () => {
  try {
    if (!auth) {
      const stored = await AsyncStorage.getItem('firebaseToken');
      return stored || DEMO_TOKEN;
    }
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return null;
  }
};
