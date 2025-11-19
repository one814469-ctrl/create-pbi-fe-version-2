import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { useTheme } from './hooks/useTheme';
import './styles/App.css';

function App() {
  const { theme } = useTheme();

  return (
    <div className={`app-container ${theme}`}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;