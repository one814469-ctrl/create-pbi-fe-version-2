import React, { useState } from 'react'
import ApplicationForm from '../components/customer/ApplicationForm'
import DocumentUpload from '../components/customer/DocumentUpload'
import ApplicationStatusTracker from '../components/customer/ApplicationStatusTracker'
import NotificationDisplay from '../components/NotificationDisplay'
import { useApplications } from '../context/ApplicationContext'
import { useAuth } from '../context/AuthContext'

function CustomerLoanApplication() {
  const [activeApplicationId, setActiveApplicationId] = useState(null)
  const [currentView, setCurrentView] = useState('apply')
  const [notification, setNotification] = useState({ message: '', type: '' })
  const { getCustomerApplications, toggleNotifications, notificationsEnabled } = useApplications()
  const { user } = useAuth()

  const customerApplications = user ? getCustomerApplications(user.email) : []

  const handleApplicationSubmitSuccess = (id) => {
    setActiveApplicationId(id)
    setCurrentView('documents')
    setNotification({ message: `Application ${id} submitted successfully! Please upload documents.`, type: 'success' })
  }

  const handleDocumentUploadSuccess = () => {
    setNotification({ message: 'Documents uploaded and submitted for verification!', type: 'success' })
    setCurrentView('status')
  }

  const handleViewStatus = (appId) => {
    setActiveApplicationId(appId)
    setCurrentView('status')
  }

  const handleStartNewApplication = () => {
    setActiveApplicationId(null)
    setCurrentView('apply')
  }

  return (
    <div className="container">
      <h2>Loan Application Portal</h2>

      {notification.message && <NotificationDisplay message={notification.message} type={notification.type} />}

      <div style={{ display: 'flex', gap: '1em', marginBottom: '2em', justifyContent: 'center' }}>
        <button onClick={() => setCurrentView('apply')} className={currentView === 'apply' ? 'active' : ''}>Apply for Loan</button>
        <button onClick={() => setCurrentView('status')} className={currentView === 'status' ? 'active' : ''} disabled={customerApplications.length === 0}>Track Status</button>
      </div>

      <div className="form-group" style={{textAlign: 'right'}}>
        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => toggleNotifications(e.target.checked)}
          />
          Enable Email/SMS Notifications
        </label>
      </div>

      {currentView === 'apply' && (
        <ApplicationForm
          onSubmitSuccess={handleApplicationSubmitSuccess}
          customerEmail={user?.email}
          customerName={user?.name}
        />
      )}

      {currentView === 'documents' && activeApplicationId && (
        <DocumentUpload
          applicationId={activeApplicationId}
          onUploadSuccess={handleDocumentUploadSuccess}
          onBackToStatus={() => setCurrentView('status')}
        />
      )}

      {currentView === 'status' && (
        <ApplicationStatusTracker
          customerEmail={user?.email}
          onViewDocuments={handleViewStatus}
          onStartNewApplication={handleStartNewApplication}
          initialApplicationId={activeApplicationId}
        />
      )}

      {currentView === 'documents' && !activeApplicationId && (
        <NotificationDisplay message="Please submit an application first." type="info" />
      )}
    </div>
  )
}

export default CustomerLoanApplication