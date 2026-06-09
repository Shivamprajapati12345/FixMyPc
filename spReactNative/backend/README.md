# FixMyPC Backend API

Backend server for FixMyPC React Native application.

## Features

- User Authentication (Register/Login)
- JWT Token-based Authentication
- Booking Management (CRUD operations)
- MongoDB Database
- RESTful API

## Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb+srv://shivam0987:shivam123@cluster0.thkv62f.mongodb.net/fixmypc?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Note:** The server.js file has a fallback MongoDB URI, so it will work even without a .env file, but it's recommended to create one for better configuration management.

4. Start the server:
```bash
# Development mode (with nodemon - auto-restart on changes)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Bookings

- `POST /api/bookings` - Create a new booking (Protected)
- `GET /api/bookings` - Get all bookings for user (Protected)
- `GET /api/bookings/:id` - Get a single booking (Protected)
- `PUT /api/bookings/:id` - Update a booking (Protected)
- `DELETE /api/bookings/:id` - Delete a booking (Protected)

## Request Examples

### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Booking
```json
POST /api/bookings
Headers: Authorization: Bearer <token>
{
  "service": "Laptop Repair",
  "brand": "HP",
  "technician": "Rahul Sharma",
  "problem": "Screen not working",
  "date": "2024-12-25",
  "address": "123 Main St, City",
  "phone": "1234567890"
}
```

## Database Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- phone (String)
- address (String)
- joinDate (String)

### Booking
- user (ObjectId, ref: User)
- service (String, required)
- brand (String)
- technician (String)
- problem (String, required)
- date (String, required)
- address (String, required)
- phone (String, required)
- status (String, enum: Pending, Confirmed, In Progress, Completed, Cancelled)
- notes (String)
