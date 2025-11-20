import React, { useState, useEffect } from 'react'
import { useApplications } from '../../context/ApplicationContext'
import { useAuth } from '../../context/AuthContext'
import NotificationDisplay from '../NotificationDisplay'
import LoadingSpinner from '../LoadingSpinner'

function ApplicationQueue({ onSelectApplication }) {
  const { applications, updateApplicationStatus, simulateCreditCheck } = useApplications()
  const { user, role } = useAuth()
  const [filteredApplications, setFilteredApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ message: '', type: '' })

  useEffect(() => {
    setLoading(true)
    let pendingApps = applications.filter(app => app.status !== 'approved' && app.status !== 'rejected')
    setFilteredApplications(pendingApps)
    setLoading(false)
  }, [applications])

  const handleAssign = async (appId) => {
    if (!user || !user.id) {
      setNotification({ message: 'Error: User not logged in or ID missing.', type: 'error' })
      return
    }
    const application = applications.find(app => app.id === appId)
    if (application && application.assignedOfficer) {
      setNotification({ message: `Application ${appId.substring(4,10)} is already assigned to ${application.assignedOfficer}.`, type: 'info' })
      return
    }

    setNotification({ message: '', type: '' })
    setLoading(true)
    try {
      await updateApplicationStatus(appId, 'assigned', `Assigned to ${user.name} (${user.id})`, user.id)
      await simulateCreditCheck(appId)
      setNotification({ message: `Application ${appId.substring(4,10)} assigned and credit check initiated.`, type: 'success' })
    } catch (error) {
      setNotification({ message: error.message || 'Failed to assign application or initiate credit check.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (filteredApplications.length === 0) {
    return (
      <div className="card">
        <h3>Pending Applications</h3>
        <p>No pending loan applications in the queue.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3>Pending Application Queue</h3>
      {notification.message && <NotificationDisplay message={notification.message} type={notification.type} />}
      <div className="dashboard-grid">
        {filteredApplications.map((app) => (
          <div key={app.id} className="list-item">
            <h4>Application #{app.id.substring(4,10)} - {app.loanType}</h4>
            <p><strong>Applicant:</strong> {app.applicantName}</p>
            <p><strong>Status:</strong> <span className={`status-badge ${app.status.toLowerCase().replace(' ', '-')}`}>{app.status.replace('-', ' ')}</span></p>
            <p><strong>Amount:</strong> MUR {app.amount?.toLocaleString()}</p>
            {app.assignedOfficer && <p><strong>Assigned To:</strong> {app.assignedOfficer}</p>}
            {app.creditScore && <p><strong>Credit Score:</strong> {app.creditScore}</p>}
            <div style={{display: 'flex', gap: '1em', marginTop: '1em', width: '100%', justifyContent: 'flex-end'}}>
              <button
                onClick={() => handleAssign(app.id)}
                disabled={app.assignedOfficer !== null || role !== 'officer'}
                style={{backgroundColor: app.assignedOfficer ? 'var(--color-muted)' : 'var(--color-primary)'}}
              >
                {app.assignedOfficer ? 'Already Assigned' : 'Assign to Me'}
              </button>
              <button onClick={() => onSelectApplication(app.id)} style={{ backgroundColor: 'var(--color-accent)' }}>
                Review Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApplicationQueue