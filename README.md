# Zynkly - Home Cleaning Service Platform

A full-stack web application for booking home cleaning services, similar to Sanbbit or Pronto. Built with React.js (Vite), Node.js, Express.js, MongoDB, and Cloudinary for image uploads.

## Features

- 🏠 **Service Management**: Browse and view different cleaning services
- 📅 **Booking System**: Book cleaning services with date, time, and address
- 👤 **User Authentication**: Register, login, and manage user accounts
- 📱 **Dashboard**: View and manage your bookings
- 🖼️ **Image Uploads**: Cloudinary integration for service images
- 🎨 **Modern UI**: Responsive design with a clean, professional interface

## Tech Stack

### Frontend
- React.js 19
- Vite
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (Image uploads)
- Bcrypt (Password hashing)

## Project Structure

```
zynkly/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth)
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   └── package.json
│
└── backend/           # Node.js + Express backend
    ├── config/        # Configuration files
    ├── middleware/    # Express middleware
    ├── models/        # MongoDB models
    ├── routes/        # API routes
    ├── server.js      # Main server file
    └── package.json
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Cloudinary account (for image uploads)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd zynkly
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zynkly
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Note**: Replace the placeholder values with your actual credentials:
- `MONGODB_URI`: Your MongoDB connection string (use MongoDB Atlas connection string for cloud)
- `JWT_SECRET`: A random secret string for JWT token signing
- Cloudinary credentials: Get these from your Cloudinary dashboard

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas (cloud) - no local setup needed.

### Seed Initial Data (Optional)

To populate the database with sample services:

```bash
cd backend
npm run seed
```

This will create 6 sample cleaning services in your database.

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

In a new terminal:
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings (user's own or all if admin)
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking (protected)
- `PATCH /api/bookings/:id/status` - Update booking status

### Uploads
- `POST /api/upload/image` - Upload image to Cloudinary (protected)
- `DELETE /api/upload/image/:publicId` - Delete image from Cloudinary (protected)

## Usage

1. **Register/Login**: Create an account or login to access booking features
2. **Browse Services**: View available cleaning services on the services page
3. **Book Service**: Click on a service to view details and book
4. **Manage Bookings**: View and manage your bookings in the dashboard
5. **Cancel Bookings**: Cancel pending or confirmed bookings from the dashboard

## Creating Admin User

To create an admin user, you can use MongoDB shell or a GUI tool like MongoDB Compass:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` directory.

### Backend
```bash
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email info@zynkly.com or create an issue in the repository.

