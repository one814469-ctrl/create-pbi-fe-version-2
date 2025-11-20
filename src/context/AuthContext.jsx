import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '@/data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setAuthLoading(false);
  }, []);

  const login = (username, password) => {
    setAuthLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate API call
        const foundUser = mockUsers.find(u => u.username === username && u.password === password);
        if (foundUser) {
          setUser(foundUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          resolve(true);
        } else {
          reject(new Error('Invalid credentials'));
        }
        setAuthLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);