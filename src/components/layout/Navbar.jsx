import React from 'react';
import { NavLink } from 'react-router-dom';
import epics from '../../data/epics.json';
import { slugify } from '../../utils/helpers';
import '../../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
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
  );
}

export default Navbar;