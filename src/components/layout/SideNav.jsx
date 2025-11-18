import React from 'react';
import { Link } from 'react-router-dom';

const SideNav = ({ epics, currentPath }) => {
  return (
    <nav className="side-nav" style={{
      width: '250px',
      backgroundColor: 'var(--color-ink)',
      padding: 'var(--spacing-l) var(--spacing-m)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ paddingBottom: 'var(--spacing-l)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: 'var(--color-gold)', fontSize: 'var(--font-size-h3)', textAlign: 'center' }}>Menu</h2>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 'var(--spacing-l)' }}>
        <li style={{ marginBottom: 'var(--spacing-s)' }}>
          <Link
            to="/"
            className="button button-secondary"
            style={{
              width: '100%',
              backgroundColor: currentPath === '/' ? 'var(--color-accent)' : 'transparent',
              color: currentPath === '/' ? 'var(--color-text-light)' : 'var(--color-text-light)',
              justifyContent: 'flex-start',
              paddingLeft: 'var(--spacing-m)',
            }}
          >
            Dashboard
          </Link>
        </li>
        {epics.map((epic) => {
          const epicSlug = `/epic/${epic.title.toLowerCase().replace(/ /g, '-')}`;
          const isActive = currentPath === epicSlug;
          return (
            <li key={epic.id} style={{ marginBottom: 'var(--spacing-s)' }}>
              <Link
                to={epicSlug}
                className="button button-secondary"
                style={{
                  width: '100%',
                  backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                  color: 'var(--color-text-light)',
                  justifyContent: 'flex-start',
                  paddingLeft: 'var(--spacing-m)',
                }}
              >
                {epic.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideNav;