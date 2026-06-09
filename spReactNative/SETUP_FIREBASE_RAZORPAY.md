# 🔥 Firebase Authentication & 💳 Razorpay Payment Setup Guide

## 📋 Prerequisites

1. Firebase Project
2. Razorpay Account
3. Node.js and npm installed

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `FixMyPC`
4. Follow the setup wizard

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** authentication
4. Click **Save**

### Step 3: Get Firebase Config

1. In Firebase Console, click the **⚙️ Settings** icon
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click **Web** icon (`</>`)
5. Register app with nickname: `FixMyPC App`
6. Copy the `firebaseConfig` object

### Step 4: Update Firebase Config

Open `firebase.config.js` and replace with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 💳 Razorpay Setup

### Step 1: Create Razorpay Account

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or Login
3. Complete KYC verification (required for live payments)

### Step 2: Get API Keys

1. In Razorpay Dashboard, go to **Settings** → **API Keys**
2. Click **Generate Test Key** (for testing)
3. Copy **Key ID** and **Key Secret**

### Step 3: Update Razorpay Keys

#### Frontend (`services/razorpay.js`):
```javascript
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';
```

#### Backend (`.env` file in `backend/`):
```env
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
```

---

## 📦 Installation

### Frontend Dependencies

```bash
npm install firebase react-native-razorpay
```

### Backend Dependencies

```bash
cd backend
npm install razorpay
```

---

## 🔧 Configuration Files

### 1. Firebase Config (`firebase.config.js`)

Already created with placeholder values. Replace with your Firebase config.

### 2. Razorpay Service (`services/razorpay.js`)

Update `RAZORPAY_KEY_ID` with your actual key.

### 3. Backend Environment (`.env`)

Create/update `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://shivam0987:shivam123@cluster0.thkv62f.mongodb.net/fixmypc?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
```

---

## 🚀 How It Works

### Authentication Flow

1. **User Registration/Login**:
   - User registers/logs in with Firebase
   - Firebase creates/authenticates user
   - User data is saved to MongoDB
   - Firebase UID is stored in MongoDB User model

2. **API Authentication**:
   - Frontend sends Firebase token + UID in headers
   - Backend verifies user exists in MongoDB by Firebase UID
   - All data is stored in MongoDB

### Payment Flow

1. **Booking Creation**:
   - User creates booking
   - Booking is saved to MongoDB
   - Booking ID is returned

2. **Payment Initiation**:
   - Frontend calls backend to create Razorpay order
   - Backend creates order in Razorpay
   - Payment record created in MongoDB (status: pending)

3. **Payment Processing**:
   - Razorpay checkout opens
   - User completes payment
   - Payment signature is verified
   - Payment status updated in MongoDB (status: completed)
   - Booking status updated to "Confirmed"

---

## 📱 Usage

### Login/Register

The Login screen now uses Firebase authentication. Users can:
- Register with email/password
- Login with email/password
- Reset password
- All data saved to MongoDB

### Booking with Payment

1. Fill booking form
2. Click "Confirm Booking"
3. Booking is created
4. Payment option appears
5. User can pay immediately or later
6. Payment processed via Razorpay
7. All data saved to MongoDB

---

## 🗄️ Database Models

### User Model
- `firebaseUid`: Firebase user ID (unique)
- `name`, `email`, `phone`, `address`
- All user data stored in MongoDB

### Booking Model
- `user`: Reference to User
- `service`, `brand`, `technician`, `problem`
- `date`, `address`, `phone`
- `status`: Pending, Confirmed, In Progress, Completed, Cancelled

### Payment Model
- `user`: Reference to User
- `booking`: Reference to Booking
- `amount`, `currency`
- `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`
- `status`: pending, completed, failed, refunded

---

## 🔒 Security Notes

1. **Firebase Keys**: Never commit Firebase config to public repos
2. **Razorpay Keys**: Keep Key Secret secure, never expose in frontend
3. **Token Verification**: Backend verifies Firebase tokens (implement Firebase Admin SDK for production)
4. **Payment Verification**: Always verify payment signature on backend

---

## 🧪 Testing

### Test Mode

1. Use Razorpay **Test Keys** for development
2. Use test cards from Razorpay documentation
3. Test payment flow without real money

### Test Cards

- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/firebase-register` - Register user (save to MongoDB)
- `POST /api/auth/firebase-login` - Login user (get from MongoDB)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment signature
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:id` - Get single payment

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] Email/Password auth enabled
- [ ] Firebase config updated in `firebase.config.js`
- [ ] Razorpay account created
- [ ] Razorpay keys obtained
- [ ] Razorpay Key ID updated in `services/razorpay.js`
- [ ] Razorpay keys added to `backend/.env`
- [ ] All dependencies installed
- [ ] Backend server running
- [ ] Test authentication flow
- [ ] Test payment flow

---

## 🆘 Troubleshooting

### Firebase Issues
- **"Firebase app not initialized"**: Check `firebase.config.js` has correct config
- **"User not found"**: User must register first, data saved to MongoDB

### Razorpay Issues
- **"Invalid key"**: Check Key ID is correct
- **"Signature mismatch"**: Verify Key Secret is correct in backend
- **Payment not completing**: Check network and Razorpay dashboard

### MongoDB Issues
- **Connection error**: Verify MongoDB URI in `.env`
- **User not saving**: Check Firebase UID is being sent correctly

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [React Native Razorpay](https://github.com/razorpay/react-native-razorpay)

---

**All data is saved in MongoDB!** ✅

Users, Bookings, Payments - everything is stored in your MongoDB database.
