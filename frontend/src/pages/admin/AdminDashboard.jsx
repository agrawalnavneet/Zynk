import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './AdminPanel.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      showToast('Error loading dashboard stats', 'error');
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your platform</p>
        </div>
        <div className="admin-empty-state">
          <div className="admin-empty-state-icon">⚠️</div>
          <h3>Unable to load stats</h3>
          <p>Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of your platform</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers || 0}</p>
            <Link to="/admin/users" className="stat-link">View all users →</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Total Bookings</h3>
            <p className="stat-value">{stats.totalBookings || 0}</p>
            <Link to="/admin/bookings" className="stat-link">View all bookings →</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <h3>Active Services</h3>
            <p className="stat-value">{stats.totalServices || 0}</p>
            <Link to="/admin/services" className="stat-link">Manage services →</Link>
          </div>
        </div>

        <div className="stat-card stat-card-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.totalRevenue || 0)}</p>
            <span className="stat-subtitle">From paid bookings</span>
          </div>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="admin-card">
        <h2>Booking Status Breakdown</h2>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">Pending</span>
            <span className="status-count admin-status-pending">
              {stats.statusCounts?.pending || 0}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Confirmed</span>
            <span className="status-count admin-status-confirmed">
              {stats.statusCounts?.confirmed || 0}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">In Progress</span>
            <span className="status-count admin-status-in-progress">
              {stats.statusCounts?.['in-progress'] || 0}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Completed</span>
            <span className="status-count admin-status-completed">
              {stats.statusCounts?.completed || 0}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Cancelled</span>
            <span className="status-count admin-status-cancelled">
              {stats.statusCounts?.cancelled || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Recent Bookings</h2>
          <Link to="/admin/bookings" className="admin-btn admin-btn-secondary admin-btn-small">
            View All
          </Link>
        </div>
        {stats.recentBookings && stats.recentBookings.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.user?.name || 'N/A'}</td>
                  <td>{booking.service?.name || 'N/A'}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`admin-status-badge admin-status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>₹{booking.totalPrice?.toLocaleString('en-IN') || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty-state">
            <p>No recent bookings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

