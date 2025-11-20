import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CustomerLoanApplicationPortalPage from './pages/CustomerLoanApplicationPortalPage';
import ApplicationStatusDisplay from './components/application/ApplicationStatusDisplay';
import LoanOfficerDashboardPage from './pages/LoanOfficerDashboardPage';
import IntegrationAutomationPage from './pages/IntegrationAutomationPage';
import ReportingAnalyticsPage from './pages/ReportingAnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/loan-application-portal" element={<CustomerLoanApplicationPortalPage />} />
            <Route path="/application-status" element={<ApplicationStatusDisplay />} />
            <Route path="/application-status/:id" element={<ApplicationStatusDisplay />} />
            <Route path="/loan-officer-dashboard" element={<LoanOfficerDashboardPage />} />
            <Route path="/loan-officer-dashboard/:id" element={<LoanOfficerDashboardPage />} />
            <Route path="/integration-automation" element={<IntegrationAutomationPage />} />
            <Route path="/reporting-analytics" element={<ReportingAnalyticsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;