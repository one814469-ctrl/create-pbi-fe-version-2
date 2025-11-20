import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="app-main" style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ fontSize: '4em', color: var('--color-primary') }}>404</h1>
      <h2 style={{ color: var('--color-accent') }}>Page Not Found</h2>
      <p style={{ fontSize: '1.2em', marginBottom: '2em' }}>
        The page you are looking for does not exist.
      </p>
      <Link to="/">
        <button className="button-primary">Go to Home Page</button>
      </Link>
    </div>
  );
};

export default NotFoundPage;