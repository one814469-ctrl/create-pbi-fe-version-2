import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Navbar dynamically renders:
 * - Core customer links (Home, Apply Loan, Application Status)
 * - All epics as links under /epic/<slug>
 * - Internal links when authenticated (Internal Dashboard, Reporting)
 */
const Navbar = ({ epics = [], isAuthenticated, onLogout }) => {
  const slugify = (title = '') =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');

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

        {/* Dynamic Epics menu (visible to all) */}
        {epics && epics.map(epic => {
          const path = `/epic/${slugify(epic.title)}`;
          return (
            <NavLink key={epic.title} to={path} className={({ isActive }) => isActive ? 'active' : ''}>
              {epic.title}
            </NavLink>
          );
        })}

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