import React from 'react';
import { NavLink } from 'react-router-dom';
import epics from '../../data/epics.json';
import { slugify } from '../../utils/helpers';
import { useTheme } from '../../hooks/useTheme';
import '../../styles/Sidebar.css';

function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">FinTrust Loans</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
              end
            >
              Home
            </NavLink>
          </li>
          {epics.map((epic, index) => (
            <li key={index}>
              <NavLink
                to={`/epic/${slugify(epic.title)}`}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {epic.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="theme-toggle-button">
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;