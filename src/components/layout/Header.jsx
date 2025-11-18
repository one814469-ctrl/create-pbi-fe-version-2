import React from 'react';
import { Link } from 'react-router-dom';
import SwanLogo from '../../assets/swan-logo.svg';

const Header = () => {
  return (
    <header className="page-header flex justify-between items-center">
      <Link to="/" className="flex items-center gap-s" style={{color: 'var(--color-ink)', textDecoration: 'none'}}>
        <img src={SwanLogo} alt="Swan Mauritius Logo" style={{ height: '32px' }} />
        <h1 style={{ marginBottom: 0, color: 'var(--color-primary)' }}>SLPS</h1>
      </Link>
      {/* Add user menu or other header elements here */}
      <nav>
        {/* Example: <Link to="/profile" className="button button-secondary">Profile</Link> */}
      </nav>
    </header>
  );
};

export default Header;