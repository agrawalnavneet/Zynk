import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchBookings();
    }
  }, [user, authLoading, navigate]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      showToast('Booking cancelled successfully', 'success');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const errorMessage = error.response?.data?.message || 'Error cancelling booking. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      'in-progress': '#14b8a6',
      completed: '#059669',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  if (authLoading || loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>My Dashboard</h1>
        <p className="welcome-message">Welcome back, {user?.name}!</p>

        <div className="dashboard-actions">
          <Link to="/services" className="action-btn">
            Book a New Service
          </Link>
        </div>

        <div className="bookings-section">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>You don't have any bookings yet.</p>
              <Link to="/services" className="btn-primary">Book a Service</Link>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.service?.name}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-label">Date:</span>
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Time:</span>
                      <span>{booking.time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Address:</span>
                      <span>
                        {booking.address.street}, {booking.address.city}, {booking.address.state}{' '}
                        {booking.address.zipCode}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Booking Type:</span>
                      <span className="booking-type-badge">
                        {booking.bookingType === 'instant' ? '⚡ Instant' : 
                         booking.bookingType === 'scheduled' ? '📅 Scheduled' : 
                         '🔄 Recurring'}
                        {booking.recurringFrequency && ` (${booking.recurringFrequency})`}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Plan:</span>
                      <span className="plan-badge-dashboard">
                        {booking.plan === 'one-time' ? 'One-Time' : booking.plan.charAt(0).toUpperCase() + booking.plan.slice(1)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total Price:</span>
                      <span className="price">${booking.totalPrice}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Payment Status:</span>
                      <span className={`payment-status-badge ${booking.paymentStatus || 'pending'}`}>
                        {booking.paymentStatus === 'paid' ? '✓ Paid' : 
                         booking.paymentStatus === 'failed' ? '✕ Failed' : 
                         booking.paymentStatus === 'refunded' ? '↩ Refunded' : 
                         '⏳ Pending'}
                      </span>
                    </div>
                    {booking.specialInstructions && (
                      <div className="detail-row">
                        <span className="detail-label">Special Instructions:</span>
                        <span>{booking.specialInstructions}</span>
                      </div>
                    )}
                  </div>
                  {booking.status === 'pending' || booking.status === 'confirmed' ? (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="cancel-btn"
                    >
                      Cancel Booking
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

