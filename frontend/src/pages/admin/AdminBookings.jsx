import { useEffect, useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './AdminPanel.css';
import './AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();

  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast('Error loading bookings', 'error');
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change the status to "${newStatus}"?`)) {
      return;
    }

    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      showToast('Booking status updated successfully', 'success');
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      const errorMessage = error.response?.data?.message || 'Error updating booking status';
      showToast(errorMessage, 'error');
    }
  };

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === statusFilter);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'admin-status-pending',
      confirmed: 'admin-status-confirmed',
      'in-progress': 'admin-status-in-progress',
      completed: 'admin-status-completed',
      cancelled: 'admin-status-cancelled',
    };
    return colors[status] || '';
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' ? 'admin-status-paid' : 'admin-status-unpaid';
  };

  if (loading) {
    return (
      <div className="admin-bookings">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-bookings">
      <div className="admin-page-header">
        <h1>Manage Bookings</h1>
        <p>View and manage all bookings</p>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="bookings-count">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </div>
      </div>

      {/* Bookings Table */}
      <div className="admin-card">
        {filteredBookings.length > 0 ? (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="booking-id">#{booking._id.slice(-6)}</td>
                    <td>
                      <div className="user-cell">
                        <div className="user-name">{booking.user?.name || 'N/A'}</div>
                        <div className="user-email">{booking.user?.email || ''}</div>
                      </div>
                    </td>
                    <td>{booking.service?.name || 'N/A'}</td>
                    <td>
                      <div className="date-cell">
                        <div>{new Date(booking.date).toLocaleDateString()}</div>
                        <div className="time">{booking.time}</div>
                      </div>
                    </td>
                    <td className="address-cell">
                      {booking.address?.street}, {booking.address?.city}
                    </td>
                    <td className="amount-cell">₹{booking.totalPrice?.toLocaleString('en-IN') || 0}</td>
                    <td>
                      <span className={`admin-status-badge ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">📅</div>
            <h3>No bookings found</h3>
            <p>{statusFilter === 'all' ? 'No bookings have been made yet.' : `No ${statusFilter} bookings found.`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;

