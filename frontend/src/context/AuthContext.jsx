import { createContext, useState, useEffect, useContext, useRef } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const handleLogout = (redirectToLogin = true) => {
    clearLogoutTimer();
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    setUser(null);
    setLoading(false);
    if (redirectToLogin) {
      // Router is nested inside AuthProvider; window redirect is safest here
      window.location.href = '/login';
    }
  };

  const scheduleAutoLogout = (expiryTimestamp) => {
    clearLogoutTimer();
    const remainingMs = expiryTimestamp - Date.now();
    if (remainingMs <= 0) {
      handleLogout();
      return;
    }
    logoutTimerRef.current = setTimeout(() => handleLogout(), remainingMs);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = parseInt(localStorage.getItem('tokenExpiry') || '', 10);

    if (token && expiry) {
      if (Date.now() >= expiry) {
        handleLogout();
        return;
      }
      scheduleAutoLogout(expiry);
      fetchUser();
    } else {
      handleLogout(false);
    }

    return () => clearLogoutTimer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      handleLogout(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        const expiry = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
        localStorage.setItem('tokenExpiry', expiry.toString());
        scheduleAutoLogout(expiry);
        setUser(res.data.user);
        return res.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to let the component handle it
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        const expiry = Date.now() + 3 * 60 * 1000; // 3 minutes
        localStorage.setItem('tokenExpiry', expiry.toString());
        scheduleAutoLogout(expiry);
        setUser(res.data.user);
        return res.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Re-throw to let the component handle it
    }
  };

  const logout = () => {
    handleLogout(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

