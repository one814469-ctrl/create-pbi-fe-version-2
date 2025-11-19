import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import ApplicationStatusPage from './pages/ApplicationStatusPage';
import InternalDashboardPage from './pages/InternalDashboardPage';
import ReportingPage from './pages/ReportingPage';
import NotFoundPage from './pages/NotFoundPage';
import EpicPage from './components/EpicPage';
import epicsData from './data/epics.json';

function slugify(title = '') {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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

          <Route path="/application" element={isAuthenticated ? <LoanApplicationPage epics={epicsData} /> : <Navigate to="/login" />} />
          <Route path="/status" element={isAuthenticated ? <ApplicationStatusPage epics={epicsData} /> : <Navigate to="/login" />} />

          <Route path="/internal-dashboard" element={isAuthenticated ? <InternalDashboardPage epics={epicsData} /> : <Navigate to="/login" />} />
          <Route path="/reporting" element={isAuthenticated ? <ReportingPage epics={epicsData} /> : <Navigate to="/login" />} />

          <Route path="/epic/:slug" element={<EpicRouteWrapper epics={epicsData} />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function EpicRouteWrapper({ epics }) {
  const { slug } = useParams();
  const epic = epics.find(e => slugify(e.title) === slug);

  if (!epic) {
    return <NotFoundPage />;
  }

  const dummyApplicationData = { status: 'N/A', history: [] };
  const dummyOnUpdateApplication = () => console.log('Dummy update for generic epic page');

  return (
    <EpicPage
      epic={epic}
      applicationData={dummyApplicationData}
      onUpdateApplication={dummyOnUpdateApplication}
      onLogin={() => console.log('Dummy login for generic epic page')}
      isAuthenticated={false}
    />
  );
}

export default App;