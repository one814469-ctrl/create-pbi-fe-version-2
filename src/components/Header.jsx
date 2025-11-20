import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, userRole, logout } = useAuth();

  return (
    <header className="app-header">
      <Link to="/" className="logo">Swan Mauritius</Link>
      <nav>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          {isLoggedIn && userRole === 'applicant' && (
            <>
              <li><NavLink to="/loan-application-portal">Apply for Loan</NavLink></li>
              <li><NavLink to="/application-status">My Applications</NavLink></li>
            </>
          )}
          {isLoggedIn && userRole === 'officer' && (
            <>
              <li><NavLink to="/loan-officer-dashboard">Loan Dashboard</NavLink></li>
            </>
          )}
          {isLoggedIn && userRole === 'compliance' && (
            <>
              <li><NavLink to="/reporting-analytics">Analytics</NavLink></li>
            </>
          )}
        </ul>
      </nav>
      <div className="auth-actions">
        {isLoggedIn ? (
          <>
            <span>Welcome, {userRole}!</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login"><button className="button-accent">Login</button></Link>
        )}
      </div>
    </header>
  );
};

export default Header;