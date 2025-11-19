import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, epics, isAuthenticated, onLogout }) => {
  return (
    <div className="main-layout-container">
      <Navbar epics={epics} isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <main className="container">
        {children}
      </main>
    </div>
  );
};

export default Layout;