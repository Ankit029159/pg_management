# PG Booking Management System

A comprehensive PG (Paying Guest) booking management system similar to BookMyShow, built with React frontend and Node.js backend with MongoDB database.

## Features

### Admin Features
1. **Building Management**
   - Add new buildings with name, address, and number of floors
   - Auto-generate floors based on the specified number
   - Manage existing buildings (edit/delete)
   - View all buildings in a table format

2. **Floor Management**
   - View all floors across buildings
   - Edit floor details
   - Auto-generated floors when building is created

3. **Room Management**
   - Add rooms to specific buildings and floors
   - Select room type (Bedroom/Hall)
   - Set number of beds and pricing
   - Auto-generate beds when room is created
   - Manage existing rooms (edit/delete)

4. **Bed Management**
   - View all beds with their status
   - Auto-generated bed IDs (e.g., R101-B1, R101-B2)
   - Track bed availability and occupancy
   - Assign/release beds

5. **Booking Management**
   - View all bookings from users
   - Accept/reject pending bookings
   - Cancel active bookings
   - Extend booking durations
   - Track payment status

### User Features
1. **Booking System**
   - No login required (similar to BookMyShow)
   - Select building, floor, room, and bed
   - View available beds with pricing
   - Book beds with check-in dates
   - Receive booking confirmation with booking ID

## System Architecture

### Backend (Node.js + Express + MongoDB)
- **Models**: Building, Floor, Room, Bed, Booking
- **Controllers**: CRUD operations for all entities
- **Routes**: RESTful API endpoints
- **Database**: MongoDB with Mongoose ODM

### Frontend (React + Tailwind CSS)
- **Admin Pages**: SetupBuilding, Managerooms, BookingDetails
- **User Pages**: Bookpg (booking form)
- **Responsive Design**: Mobile-friendly interface

## Database Schema

### Building
- Building ID (auto-generated: B001, B002, etc.)
- Name, Address, Number of Floors
- Created/Updated timestamps

### Floor
- Floor Number, Building Reference
- Building Name, Total Rooms
- Auto-generated when building is created

### Room
- Room ID (auto-generated: R101, R102, etc.)
- Building, Floor references
- Room Type (Bedroom/Hall)
- Total Beds, Available Beds, Rate
- Rate Type (per bed/per room)

### Bed
- Bed ID (auto-generated: R101-B1, R101-B2, etc.)
- Room reference, Bed Number
- Status (Available/Occupied/Maintenance)
- Price, User assignment
- Auto-generated when room is created

### Booking
- Booking ID (auto-generated: BK001, BK002, etc.)
- User details (name, ID)
- Bed, Room, Building references
- Check-in/Check-out dates
- Status, Payment status
- Admin actions (accept/reject)

## 🚀 Production Deployment

### Live URLs
- **Frontend**: https://pg.gradezy.in
- **Backend**: https://api.pg.gradezy.in

### Quick Deployment
```bash
# Frontend (Production Build)
cd frontend
./build_production.sh          # Linux/Mac
# or
build_production.bat           # Windows

# Backend (Production Start)
cd backend
npm run prod
```

### Production Configuration
- Environment variables configured for production
- CORS set to production domain only
- PhonePe payment integration ready
- PM2 process manager scripts included

📖 **Full Deployment Guide**: [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)

---

## API Endpoints

### Buildings
- `POST /api/buildings/add` - Add new building
- `GET /api/buildings/all` - Get all buildings
- `GET /api/buildings/:id` - Get building by ID
- `PUT /api/buildings/:id` - Update building
- `DELETE /api/buildings/:id` - Delete building

### Floors
- `GET /api/floors/all` - Get all floors
- `GET /api/floors/building/:buildingId` - Get floors by building
- `PUT /api/floors/:id` - Update floor
- `DELETE /api/floors/:id` - Delete floor

### Rooms
- `POST /api/rooms/add` - Add new room
- `GET /api/rooms/all` - Get all rooms
- `GET /api/rooms/building/:buildingId/floor/:floorId` - Get rooms by building and floor
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Beds
- `GET /api/beds/all` - Get all beds
- `GET /api/beds/room/:roomId` - Get beds by room
- `GET /api/beds/available` - Get available beds
- `PUT /api/beds/:id` - Update bed
- `PUT /api/beds/:id/assign` - Assign bed to user
- `PUT /api/beds/:id/release` - Release bed

### Bookings
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/all` - Get all bookings (admin)
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/payment` - Update payment status
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/extend` - Extend booking

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Set up environment variables (optional)
# MONGODB_URI=mongodb://localhost:27017/pg_management
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
1. Ensure MongoDB is running
2. The application will automatically create collections and indexes
3. Start with adding buildings through the admin interface

## Usage Flow

### Admin Setup
1. **Setup Building**: Add buildings and floors
2. **Manage Rooms**: Add rooms and beds
3. **View Bookings**: Monitor and manage user bookings

### User Booking
1. **Select Building**: Choose from available buildings
2. **Select Floor**: Choose floor within building
3. **Select Room**: Choose room type and see pricing
4. **Select Bed**: Choose available bed
5. **Enter Details**: Name and check-in date
6. **Confirm Booking**: Receive booking ID

## Key Features

- **Auto-generation**: Building IDs, Floor numbers, Room IDs, Bed IDs, Booking IDs
- **Cascading Updates**: When building is deleted, all related floors are deleted
- **Real-time Availability**: Bed availability updates automatically
- **No User Registration**: Simple booking without login (like BookMyShow)
- **Admin Controls**: Full control over bookings, rooms, and buildings
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Development**: Vite, Nodemon
- **Styling**: Tailwind CSS with responsive design

## Future Enhancements

- Payment gateway integration
- Email notifications
- User dashboard for booking history
- Room/bed images
- Advanced search and filtering
- Booking calendar view
- Maintenance scheduling
- Reports and analytics
