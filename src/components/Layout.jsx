import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children, epics, isAuthenticated, onLogout }) => {
  return (
    <div className="layout">
      <Navbar epics={epics} isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <main className="container">
        {children}
      </main>
    </div>
  );
};

export default Layout;