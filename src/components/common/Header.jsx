import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <h1>FinTrust Loan Application Portal</h1>
      <div className="auth-controls">
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <span>Guest</span>
        )}
      </div>
    </header>
  );
};

export default Header;