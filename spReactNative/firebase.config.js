// Firebase Configuration
// Replace these with your Firebase project credentials
// Get them from: https://console.firebase.google.com/

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA0s18SQku0dTeGeOfuFJDmDHbXRmMSSMI",
  authDomain: "fixmypc2-20061.firebaseapp.com",
  projectId: "fixmypc2-20061",
  storageBucket: "fixmypc2-20061.firebasestorage.app",
  messagingSenderId: "716249832642",
  appId: "1:716249832642:web:033e7a4c9c2c84a5abef5b"
};

// Initialize Firebase (with graceful fallback so app doesn't crash)
let app = null;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.warn('Firebase app initialization failed - running in demo mode:', error);
  app = null;
}

// Initialize Auth with AsyncStorage persistence (may be null in demo mode)
let auth = null;
if (app) {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      try {
        auth = getAuth(app);
      } catch (getAuthError) {
        console.warn('Auth initialization failed - using demo auth mode:', getAuthError);
        auth = null;
      }
    }
  }
}

const db = app ? getFirestore(app) : null;

export { auth, db, app };
