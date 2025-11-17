import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  // Hide the regular navbar (and cart) on admin routes
  if (location.pathname.startsWith('/admin')) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Zynkly
          </Link>
          <ul className="navbar-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            {user ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                {user.role === 'admin' && (
                  <li><Link to="/admin" className="admin-link">Admin Panel</Link></li>
                )}
                <li>
                  <button className="cart-icon-btn" onClick={() => setCartOpen(true)} title="View Cart">
                    🛒 Cart
                    {getTotalItems() > 0 && (
                      <span className="cart-badge">{getTotalItems()}</span>
                    )}
                  </button>
                </li>
                <li><span className="user-name">{user.name}</span></li>
                <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
              </>
            ) : (
              <>
                <li>
                  <button className="cart-icon-btn" onClick={() => setCartOpen(true)} title="View Cart">
                    🛒 Cart
                    {getTotalItems() > 0 && (
                      <span className="cart-badge">{getTotalItems()}</span>
                    )}
                  </button>
                </li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register" className="register-btn">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;

