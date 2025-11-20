import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = ({ epics, isAuthenticated }) => {
  return (
    <nav className="navigation">
      <h3>Navigation</h3>
      <ul>
        {epics.map((epic) => {
          const slug = epic.title.toLowerCase().replace(/\s+/g, '-');
          // For simplicity, we'll allow all epics to be navigable
          // In a real app, some might be admin-only or require specific roles.
          // The guardrail "access denied" for audit trail is handled within the task component.
          return (
            <li key={epic.title}>
              <NavLink
                to={`/epics/${slug}`}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {epic.title}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;