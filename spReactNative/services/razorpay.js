import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../config/api';

// Razorpay Key ID - Replace with your actual key
// Get it from: https://dashboard.razorpay.com/app/keys
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';

// Create order and initiate payment
export const initiatePayment = async (amount, bookingId, description) => {
  try {
    // Get Firebase token for authentication
    const firebaseToken = await AsyncStorage.getItem('firebaseToken');
    const firebaseUid = await AsyncStorage.getItem('firebaseUid');

    // Create order on backend
    const orderResponse = await axios.post(
      `${API_BASE_URL}/api/payments/create-order`,
      {
        amount: amount * 100, // Convert to paise (Razorpay uses smallest currency unit)
        currency: 'INR',
        bookingId,
        description: description || 'FixMyPC Service Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
          'X-Firebase-UID': firebaseUid,
        },
      }
    );

    const order = orderResponse.data.order;

    // Initialize Razorpay checkout
    const options = {
      description: description || 'FixMyPC Service Payment',
      image: 'https://your-logo-url.com/logo.png', // Your app logo
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // Amount in paise
      name: 'FixMyPC',
      order_id: order.razorpayOrderId,
      prefill: {
        email: order.userEmail || '',
        contact: order.userPhone || '',
        name: order.userName || '',
      },
      theme: { color: '#007bff' },
    };

    // Open Razorpay checkout
    const paymentData = await RazorpayCheckout.open(options);

    // Verify payment on backend
    const verifyResponse = await axios.post(
      `${API_BASE_URL}/api/payments/verify-payment`,
      {
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpaySignature: paymentData.razorpay_signature,
        bookingId,
      },
      {
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
          'X-Firebase-UID': firebaseUid,
        },
      }
    );

    return {
      success: true,
      payment: verifyResponse.data.payment,
      booking: verifyResponse.data.booking,
    };
  } catch (error) {
    console.error('Payment error:', error);
    
    // Handle user cancellation
    if (error.code === 'RazorpayCheckout' && error.description === 'User closed checkout') {
      return {
        success: false,
        cancelled: true,
        message: 'Payment cancelled by user',
      };
    }

    throw error;
  }
};

// Get payment history
export const getPaymentHistory = async () => {
  try {
    const firebaseToken = await AsyncStorage.getItem('firebaseToken');
    const firebaseUid = await AsyncStorage.getItem('firebaseUid');

    const response = await axios.get(`${API_BASE_URL}/api/payments/history`, {
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
        'X-Firebase-UID': firebaseUid,
      },
    });

    return response.data.payments;
  } catch (error) {
    console.error('Get payment history error:', error);
    throw error;
  }
};
