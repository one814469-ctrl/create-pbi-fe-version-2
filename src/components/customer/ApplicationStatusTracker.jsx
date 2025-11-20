import React, { useState, useEffect } from 'react'
import { useApplications } from '../../context/ApplicationContext'
import { useAuth } from '../../context/AuthContext'
import NotificationDisplay from '../NotificationDisplay'
import LoadingSpinner from '../LoadingSpinner'

function ApplicationStatusTracker({ customerEmail, onStartNewApplication, initialApplicationId }) {
  const { getCustomerApplications, getApplicationById } = useApplications()
  const { isAuthenticated, user } = useAuth()
  const [customerApplications, setCustomerApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !customerEmail) {
      setError("You must be logged in to view application status.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    const apps = getCustomerApplications(customerEmail)
    setCustomerApplications(apps)
    if (initialApplicationId) {
      setSelectedApplication(apps.find(app => app.id === initialApplicationId))
    } else if (apps.length > 0) {
      setSelectedApplication(apps[0])
    } else {
      setSelectedApplication(null)
    }
    setLoading(false)
  }, [isAuthenticated, customerEmail, getCustomerApplications, initialApplicationId])

  const formatTimestamp = (isoString) => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    return date.toLocaleString()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <NotificationDisplay message={error} type="error" />
  }

  if (customerApplications.length === 0) {
    return (
      <div className="card">
        <h3>Your Application Status</h3>
        <p>You have no existing loan applications.</p>
        <button onClick={onStartNewApplication}>Start New Application</button>
      </div>
    )
  }

  return (
    <div className="card">
      <h3>Your Application Status</h3>

      <div className="form-group" style={{ marginBottom: '1.5em' }}>
        <label htmlFor="selectApplication">Select Application:</label>
        <select
          id="selectApplication"
          value={selectedApplication ? selectedApplication.id : ''}
          onChange={(e) => setSelectedApplication(customerApplications.find(app => app.id === e.target.value))}
        >
          {customerApplications.map((app) => (
            <option key={app.id} value={app.id}>
              {app.loanType} - #{app.id.substring(4,10)} - {app.status.toUpperCase().replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      {selectedApplication ? (
        <div>
          <p><strong>Applicant:</strong> {selectedApplication.applicantName}</p>
          <p><strong>Loan Type:</strong> {selectedApplication.loanType}</p>
          <p><strong>Loan Amount:</strong> MUR {selectedApplication.amount?.toLocaleString()}</p>
          <p><strong>Current Status:</strong> <span className={`status-badge ${selectedApplication.status.toLowerCase().replace(' ', '-')}`}>{selectedApplication.status.replace('-', ' ')}</span></p>
          <p><strong>Submitted On:</strong> {formatTimestamp(selectedApplication.submittedAt)}</p>

          <h4 style={{ marginTop: '2em', borderTop: '1px solid #f0f0f0', paddingTop: '1em' }}>Application History:</h4>
          {selectedApplication.updates && selectedApplication.updates.length > 0 ? (
            <ul>
              {selectedApplication.updates.map((update, index) => (
                <li key={index}>
                  <strong>{formatTimestamp(update.timestamp)}:</strong> {update.message}
                </li>
              ))}
            </ul>
          ) : (
            <p>No status updates yet.</p>
          )}

          <h4 style={{ marginTop: '2em', borderTop: '1px solid #f0f0f0', paddingTop: '1em' }}>Uploaded Documents:</h4>
          {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
            <ul>
              {selectedApplication.documents.map((doc, index) => (
                <li key={index}>
                  {doc.name} - <span className={`status-badge ${doc.status.toLowerCase().replace(' ', '-')}`}>{doc.status.replace('-', ' ')}</span>
                  {doc.message && <span style={{fontSize: '0.9em', marginLeft: '0.5em', color: 'var(--color-muted)'}}>({doc.message})</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents uploaded yet.</p>
          )}

          <button onClick={() => onStartNewApplication()} style={{ marginTop: '2em' }}>Start New Application</button>
        </div>
      ) : (
        <NotificationDisplay message="Select an application to view its status." type="info" />
      )}
    </div>
  )
}

export default ApplicationStatusTracker