import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import SideNav from './components/layout/SideNav';
import Container from './components/layout/Container';
import EpicPage from './components/EpicPage/EpicPage';
import Dashboard from './pages/Dashboard';
import { appRoutes } from './router'; // Centralized route definitions
import epicsData from './data/epics.json'; // Directly consume epics.json

function AppContent() {
  const location = useLocation();

  return (
    <div className="app-container">
      <SideNav epics={epicsData} currentPath={location.pathname} />
      <div className="main-content-area">
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={<EpicPage epic={route.epic} />} />
            ))}
            <Route path="*" element={
              <div className="page-content text-center" style={{paddingTop: 'var(--spacing-xxl)'}}>
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            } />
          </Routes>
        </Container>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;