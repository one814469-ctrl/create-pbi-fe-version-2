import React, { useState } from 'react'

const ManualReviewOverride = ({ task, isAuthenticated, hasOverridePermissions, applications, onOverride }) => {
  const [selectedAppId, setSelectedAppId] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [justification, setJustification] = useState('')
  const [message, setMessage] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="card">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p className="alert alert-danger">401 Unauthorized: Please log in to access this feature.</p>
      </div>
    )
  }

  if (!hasOverridePermissions) {
    return (
      <div className="card">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p className="alert alert-danger">Permission Denied: You do not have override permissions.</p>
      </div>
    )
  }

  const flaggedApplications = applications.filter(app => app.flagged || app.status === 'Flagged for Review')

  const handleOverrideSubmit = (e) => {
    e.preventDefault()
    setMessage('')

    if (!selectedAppId || !newStatus || !justification) {
      setMessage('All override fields (Application ID, New Status, Justification) are required.')
      return
    }

    if (onOverride(selectedAppId, newStatus, justification)) {
      setMessage(`Application ${selectedAppId} decision overridden to "${newStatus}".`)
      setSelectedAppId('')
      setNewStatus('')
      setJustification('')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      {flaggedApplications.length > 0 && (
        <>
          <h5>Flagged Applications for Review:</h5>
          <ul>
            {flaggedApplications.map(app => (
              <li key={app.id}>
                {app.id} - {app.applicant} - Status: {app.status}
              </li>
            ))}
          </ul>
        </>
      )}

      <form onSubmit={handleOverrideSubmit}>
        <div className="form-group">
          <label htmlFor="appIdOverride">Application ID to Override:</label>
          <select
            id="appIdOverride"
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
          >
            <option value="">Select Application</option>
            {applications.map(app => (
              <option key={app.id} value={app.id}>{app.id} - {app.applicant}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="newStatus">New Status:</label>
          <select
            id="newStatus"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="">Select New Status</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="justification">Justification for Override:</label>
          <textarea
            id="justification"
            rows="4"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Provide detailed justification for overriding the automated decision."
          ></textarea>
        </div>
        {message && <p className={message.includes('required') ? 'error-message' : 'success-message'}>{message}</p>}
        <button type="submit">Finalize Decision</button>
      </form>
    </div>
  )
}

export default ManualReviewOverride