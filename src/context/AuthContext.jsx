import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLoginState = localStorage.getItem('isLoggedIn');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedLoginState === 'true' && storedUserRole) {
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
    }
  }, []);

  const login = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
    navigate('/');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const checkAuth = (requiredRole = null) => {
    if (!isLoggedIn) {
      navigate('/login');
      return false;
    }
    if (requiredRole && userRole !== requiredRole) {
      navigate('/');
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);