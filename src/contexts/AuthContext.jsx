import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/common/Notification';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'user' && password === 'password') {
          const loggedInUser = { name: 'FinTrust Customer', id: '123' };
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          setUser(loggedInUser);
          setIsAuthenticated(true);
          setLoading(false);
          resolve(true);
        } else {
          setLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    showNotification('You have been logged out.', 'info');
    navigate('/epic/account-authentication-access');
  };

  const checkSession = () => {
    if (!isAuthenticated && localStorage.getItem('user')) {
      showNotification('Your session has timed out. Please log in again.', 'warning');
      logout();
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};