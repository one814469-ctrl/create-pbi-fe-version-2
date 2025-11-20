import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = ({ epics }) => {
  return (
    <nav className="navigation">
      <h3>Epics</h3>
      <ul>
        {epics.map((epic) => {
          const slug = epic.title.toLowerCase().replace(/\s+/g, '-');
          return (
            <li key={epic.title}>
              <NavLink
                to={`/epics/${slug}`}
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
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