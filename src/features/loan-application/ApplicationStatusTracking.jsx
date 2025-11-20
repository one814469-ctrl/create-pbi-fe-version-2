import React from 'react'
import { Link } from 'react-router-dom'

const ApplicationStatusTracking = ({ task, isLoggedIn, applicationUpdates, applicationId }) => {
  if (!isLoggedIn) {
    return (
      <div className="card">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p className="alert alert-danger">401 Unauthorized: You must be logged in to view application status.</p>
      </div>
    )
  }

  const applications = applicationUpdates.filter(app => app.id === applicationId)

  if (!applicationId || applications.length === 0) {
    return (
      <div className="card">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p className="alert alert-info">No existing applications found.</p>
        <Link to="/loan-application" className="button">Start New Application</Link>
      </div>
    )
  }

  return (
    <div className="card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      {applications.map((app, index) => (
        <div key={app.id || index} className="application-status-item">
          <h5>Application ID: {app.id}</h5>
          <p><strong>Current Status:</strong> <span style={{ color: app.status.includes('Approved') ? 'var(--color-success)' : app.status.includes('Rejected') ? 'var(--color-error)' : 'var(--color-primary)', fontWeight: 'bold' }}>{app.status}</span></p>
          <p><strong>Last Updated:</strong> {app.timestamp}</p>
          {app.documents && app.documents.length > 0 && (
            <div>
              <h6>Uploaded Documents:</h6>
              <ul>
                {app.documents.map((doc, docIndex) => (
                  <li key={docIndex}>
                    {doc.name} - Status: {doc.verificationStatus}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ApplicationStatusTracking