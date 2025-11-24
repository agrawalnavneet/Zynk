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
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide the regular navbar (and cart) on admin routes
  if (location.pathname.startsWith('/admin')) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const openCart = () => {
    setCartOpen(true);
    closeMenu();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
          

 {/*<img src="/vite.jpeg" alt="Zynkly Logo" className="logo-image" /> */}
            <span>Zynkly</span>
          </Link>
          <button
            className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
          <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
            {user ? (
              <>
                <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
                {user.role === 'admin' && (
                  <li><Link to="/admin" className="admin-link" onClick={closeMenu}>Admin Panel</Link></li>
                )}
                <li>
                  <button className="cart-icon-btn" onClick={openCart} title="View Cart">
                    🛒 Cart
                    {getTotalItems() > 0 && (
                      <span className="cart-badge">{getTotalItems()}</span>
                    )}
                  </button>
                </li>
                <li><span className="user-name">{user.name}</span></li>
                <li><button onClick={() => { handleLogout(); closeMenu(); }} className="logout-btn">Logout</button></li>
              </>
            ) : (
              <>
                <li>
                  <button className="cart-icon-btn" onClick={openCart} title="View Cart">
                    🛒 Cart
                    {getTotalItems() > 0 && (
                      <span className="cart-badge">{getTotalItems()}</span>
                    )}
                  </button>
                </li>
                <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
                <li><Link to="/register" className="register-btn" onClick={closeMenu}>Sign Up</Link></li>
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

