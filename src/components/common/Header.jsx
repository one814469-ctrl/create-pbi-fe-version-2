import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Import useAuth to get user info

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user information

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <h1>FinTrust Loan Application Portal</h1>
      <div className="auth-controls">
        {isAuthenticated && user && (
          <span className="text-sm">Welcome, {user.username} (<span className="capitalize">{user.role}</span>)</span>
        )}
        {isAuthenticated ? (
          <button onClick={handleLogout} className="button-secondary">
            Logout
          </button>
        ) : (
          <button onClick={() => navigate('/epics/account-authentication-access')} className="button-secondary">
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;