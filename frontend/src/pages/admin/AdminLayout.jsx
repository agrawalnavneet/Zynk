import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(`/admin${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-panel">
      <button className="admin-menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={closeSidebar}></div>}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          <h2>Zynkly Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link
            to="/admin"
            className={`admin-nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link
            to="/admin/bookings"
            className={`admin-nav-link ${isActive('/bookings') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon">📅</span>
            Bookings
          </Link>
          <Link
            to="/admin/services"
            className={`admin-nav-link ${isActive('/services') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon">🔧</span>
            Services
          </Link>
          <Link
            to="/admin/users"
            className={`admin-nav-link ${isActive('/users') ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon">👥</span>
            Users
          </Link>
        </nav>
        <div className="admin-footer">
          <div className="admin-user-info">
            <span>
              Logged in as: <strong>{user?.name || 'Admin'}</strong>
            </span>
          </div>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <span className="nav-icon">↩︎</span>
            Logout
          </button>
          <Link to="/dashboard" className="admin-nav-link" onClick={closeSidebar}>
            <span className="nav-icon">🏠</span>
            User Dashboard
          </Link>
        </div>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

