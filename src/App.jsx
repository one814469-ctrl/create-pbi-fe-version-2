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
import epicsData from './data/epics.json'; // The PBIs JSON input

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

  // Function to get slug from title for routing
  const getSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');

  const getPagePath = (epicTitle) => {
    const slug = getSlug(epicTitle);
    switch (slug) {
      case 'loan-application-portal': return '/'; // Home page
      case 'internal-loan-management-dashboard': return '/internal-dashboard';
      case 'reporting-analytics': return '/reporting';
      default: return `/${slug}`; // Generic path for other epics if needed
    }
  };

  // Filter epics that have dedicated pages or are explicitly handled
  const customerFacingEpics = epicsData.filter(epic => epic.title === "Loan Application Portal");
  const internalFacingEpics = epicsData.filter(epic => 
    epic.title === "Internal Loan Management Dashboard" || 
    epic.title === "Reporting & Analytics"
  );
  // Other epics are handled as components/features within pages, not top-level routes.

  return (
    <Router>
      <Layout epics={epicsData} isAuthenticated={isAuthenticated} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage epics={customerFacingEpics} isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />

          {/* Customer-facing protected routes */}
          <Route path="/application" element={isAuthenticated ? <LoanApplicationPage epics={epicsData} /> : <Navigate to="/login" />} />
          <Route path="/status" element={isAuthenticated ? <ApplicationStatusPage epics={epicsData} /> : <Navigate to="/login" />} />
          
          {/* Internal-facing protected routes */}
          <Route path="/internal-dashboard" element={isAuthenticated ? <InternalDashboardPage epics={epicsData} /> : <Navigate to="/login" />} />
          <Route path="/reporting" element={isAuthenticated ? <ReportingPage epics={epicsData} /> : <Navigate to="/login" />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;