# PG Management System - Admin Authentication

A complete PG (Pay Guest) management system with professional admin authentication and authorization.

## Features

### Admin Authentication System
- **Secure Registration**: Admin registration with all required fields
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Admin pages are protected with authentication middleware
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **Form Validation**: Client-side and server-side validation
- **Password Security**: Bcrypt hashing for password security

### Admin Registration Fields
- PG Name
- Admin Person Name
- Mobile Number (10-digit validation)
- Email ID
- Complete Address
- Aadhar Card Number (12-digit validation)
- Password (with strength requirements)
- Confirm Password

### Admin Login
- Email and Password authentication
- JWT token generation
- Automatic redirect to admin dashboard
- Session management

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcryptjs** for password hashing
- **Express-validator** for input validation
- **CORS** for cross-origin requests

### Frontend
- **React.js** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Icons** for icons
- **Local Storage** for token management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/pg_management
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_2024
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Admin registration
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile (protected)
- `POST /api/auth/logout` - Admin logout (protected)

### Request/Response Examples

#### Register Admin
```json
POST /api/auth/register
{
  "pgName": "Sunshine PG",
  "adminName": "John Doe",
  "mobileNumber": "9876543210",
  "email": "admin@sunshinepg.com",
  "address": "123 Main Street, City, State - 123456",
  "aadharCard": "123456789012",
  "password": "Admin123",
  "confirmPassword": "Admin123"
}
```

#### Login Admin
```json
POST /api/auth/login
{
  "email": "admin@sunshinepg.com",
  "password": "Admin123"
}
```

## File Structure

```
Final_pg/
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   └── Admin.js
│   ├── routes/
│   │   └── auth.js
│   ├── db/
│   │   └── dbconnection.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Adminlogin.jsx
│   │   │   └── AdminRegister.jsx
│   │   ├── components/layout/
│   │   │   └── AdminLayout.jsx
│   │   ├── utils/
│   │   │   └── AdminProtected.js
│   │   └── routes/
│   │       └── AppRoutes.jsx
│   └── package.json
└── README.md
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
2. **JWT Tokens**: Secure token-based authentication with 7-day expiration
3. **Input Validation**: Both client-side and server-side validation
4. **Protected Routes**: Admin pages require valid authentication
5. **Token Verification**: Automatic token verification on protected routes
6. **Secure Headers**: CORS and other security headers implemented

## Usage

1. **Register as Admin**: Visit `/adminregister` to create a new admin account
2. **Login**: Visit `/adminlogin` to sign in with email and password
3. **Access Admin Panel**: After successful login, you'll be redirected to `/admin/dashboard`
4. **Logout**: Use the logout button in the admin panel to sign out

## Admin Panel Features

- **Dashboard**: Overview of PG management
- **Setup Building**: Configure building details
- **Manage Rooms**: Room management functionality
- **About Page Management**: Manage about page content
- **Hero Section Management**: Manage hero section content
- **Services Management**: Manage services offered
- **Gallery Management**: Manage photo gallery
- **Contact Management**: Handle contact queries
- **Booking Details**: View and manage bookings
- **Payment History**: Track payment records

## Error Handling

The system includes comprehensive error handling for:
- Invalid credentials
- Duplicate email/mobile/aadhar
- Token expiration
- Network errors
- Validation errors
- Server errors

## Development

### Adding New Admin Features
1. Create new routes in `backend/routes/`
2. Add controllers in `backend/controllers/`
3. Create models if needed in `backend/models/`
4. Add frontend components in `frontend/src/`
5. Update routes in `frontend/src/routes/AppRoutes.jsx`

### Environment Variables
Make sure to set up proper environment variables for production:
- Use a strong JWT secret
- Configure production MongoDB URI
- Set appropriate CORS origins
- Enable HTTPS in production

## Support

For any issues or questions, please check the console logs for detailed error messages and ensure all dependencies are properly installed.
