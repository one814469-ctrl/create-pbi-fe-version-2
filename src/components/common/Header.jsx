import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext'; // Import useAuth to get user info

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user information

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground shadow-md">
      <h1 className="text-2xl font-bold">FinTrust Loan Application Portal</h1>
      <div className="flex items-center space-x-4">
        {isAuthenticated && user && (
          <span className="text-sm">Welcome, {user.username} (<span className="capitalize">{user.role}</span>)</span>
        )}
        {isAuthenticated ? (
          <Button onClick={handleLogout} variant="secondary">
            Logout
          </Button>
        ) : (
          <Button onClick={() => navigate('/epics/account-authentication-access')} variant="secondary">
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;