import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import ApplicationStatusPage from './pages/ApplicationStatusPage';
import InternalDashboardPage from './pages/InternalDashboardPage';
import ReportingPage from './pages/ReportingPage';
import NotFoundPage from './pages/NotFoundPage';
import EpicPage from './components/EpicPage';
import epicsData from './data/epics.json'; // The PBIs JSON input

function slugify(title = '') {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock authentication state

  useEffect(() => {
    // Simulate checking for an existing session
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <Layout epics={epicsData} isAuthenticated={isAuthenticated} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage epics={epicsData} isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />

          {/* Customer-facing protected routes */}
          <Route path="/application" element={isAuthenticated ? <LoanApplicationPage epics={epicsData} /> : <Navigate to="/login" />} />
          <Route path="/status" element={isAuthenticated ? <ApplicationStatusPage epics={epicsData} /> : <Navigate to="/login" />} />

          {/* Internal-facing protected routes */}
          <Route path="/internal-dashboard" element={isAuthenticated ? <InternalDashboardPage epics={epicsData} /> : <Navigate to="/login" />} />
          <Route path="/reporting" element={isAuthenticated ? <ReportingPage epics={epicsData} /> : <Navigate to="/login" />} />

          {/* Generic Epic route: each Epic becomes /epic/:slug */}
          <Route path="/epic/:slug" element={<EpicRouteWrapper epics={epicsData} />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

/**
 * Wrapper to find epic by slug and render EpicPage
 */
function EpicRouteWrapper({ epics }) {
  // we import useParams inside component to avoid SSR issues
  const { useParams } = require('react-router-dom');
  const params = useParams();
  const slug = params?.slug || '';
  const epic = epics.find(e => slugify(e.title) === slug);
  return <EpicPage epic={epic} />;
}

export default App;