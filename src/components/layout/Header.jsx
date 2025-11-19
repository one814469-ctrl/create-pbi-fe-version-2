import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import '../../styles/Header.css';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-title">Loan Application Portal</div>
      <div className="header-actions">
        {isAuthenticated ? (
          <>
            <span className="user-greeting">Hello, {user.name}!</span>
            <button onClick={logout} className="button button-secondary">
              Logout
            </button>
          </>
        ) : (
          <span className="user-greeting">Guest User</span>
        )}
        <button onClick={toggleTheme} className="theme-toggle-icon" aria-label="Toggle theme">
          {theme === 'light' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header;