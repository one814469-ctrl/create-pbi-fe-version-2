import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoanApplicationPortalPage from './pages/LoanApplicationPortalPage'
import LoanManagementDashboardPage from './pages/LoanManagementDashboardPage'
import AutomatedDocumentVerificationPage from './pages/AutomatedDocumentVerificationPage'
import CreditCheckIntegrationPage from './pages/CreditCheckIntegrationPage'
import NotificationsAndRemindersPage from './pages/NotificationsAndRemindersPage'
import ReportingAndAnalyticsPage from './pages/ReportingAndAnalyticsPage'
import epicsData from './data/epics.json'

const App = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {epicsData.map(epic => (
            <Route
              key={epic.route}
              path={epic.route}
              element={
                epic.title === "Loan Application Portal" ? <LoanApplicationPortalPage epic={epic} /> :
                epic.title === "Loan Management Dashboard" ? <LoanManagementDashboardPage epic={epic} /> :
                epic.title === "Automated Document Verification" ? <AutomatedDocumentVerificationPage epic={epic} /> :
                epic.title === "Credit Check Integration" ? <CreditCheckIntegrationPage epic={epic} /> :
                epic.title === "Notifications and Reminders" ? <NotificationsAndRemindersPage epic={epic} /> :
                epic.title === "Reporting and Analytics" ? <ReportingAndAnalyticsPage epic={epic} /> :
                <p>Page Not Found</p>
              }
            />
          ))}
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App