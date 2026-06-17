import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import About from './pages/About';
import ThankYou from './pages/ThankYou';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from './pages/admin/AdminUsers';
import { useAuth } from './context/AuthContext';
import './App.css';

// Wrapper that redirects admin users to the admin panel
const AdminRedirect = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AdminRedirect><Home /></AdminRedirect>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/services" element={<AdminRedirect><Services /></AdminRedirect>} />
        <Route path="/services/:id" element={<AdminRedirect><ServiceDetail /></AdminRedirect>} />
        <Route path="/booking/:id" element={<AdminRedirect><Booking /></AdminRedirect>} />
        <Route path="/checkout" element={<AdminRedirect><Checkout /></AdminRedirect>} />
        <Route path="/dashboard" element={<AdminRedirect><Dashboard /></AdminRedirect>} />
        <Route path="/thank-you" element={<AdminRedirect><ThankYou /></AdminRedirect>} />
        <Route path="/contact" element={<AdminRedirect><Contact /></AdminRedirect>} />
        <Route path="/about" element={<AdminRedirect><About /></AdminRedirect>} />

        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
