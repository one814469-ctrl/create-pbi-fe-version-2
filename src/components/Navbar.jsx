import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = ({ epics, isAuthenticated, onLogout }) => {
  // Define explicit routes for primary epics
  const getEpicRoute = (epicTitle) => {
    switch (epicTitle) {
      case 'Loan Application Portal': return '/';
      case 'Internal Loan Management Dashboard': return '/internal-dashboard';
      case 'Reporting & Analytics': return '/reporting';
      default: return null; // These epics might not have top-level routes
    }
  };

  const customerNavLinks = [
    { title: 'Home', path: '/' },
    { title: 'Apply Loan', path: '/application', requiresAuth: true },
    { title: 'Application Status', path: '/status', requiresAuth: true },
  ];

  const internalNavLinks = [
    { title: 'Internal Dashboard', path: '/internal-dashboard', requiresAuth: true },
    { title: 'Reporting', path: '/reporting', requiresAuth: true },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">FinTrust Loan Portal</Link>
      <div className="navbar-nav">
        {customerNavLinks.map(link => (
          (!link.requiresAuth || isAuthenticated) && (
            <NavLink key={link.title} to={link.path} className={({ isActive }) => isActive ? 'active' : ''}>
              {link.title}
            </NavLink>
          )
        ))}
        {isAuthenticated && (
          <>
            {internalNavLinks.map(link => (
              <NavLink key={link.title} to={link.path} className={({ isActive }) => isActive ? 'active' : ''}>
                {link.title}
              </NavLink>
            ))}
            <button onClick={onLogout}>Logout</button>
          </>
        )}
        {!isAuthenticated && (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;