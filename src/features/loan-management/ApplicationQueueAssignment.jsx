import React, { useState } from 'react'

const ApplicationQueueAssignment = ({ task, isAuthenticated, applications, onAssign }) => {
  const [assignmentMessage, setAssignmentMessage] = useState('')
  const [selectedOfficer, setSelectedOfficer] = useState('Loan Officer A')

  if (!isAuthenticated) {
    return (
      <div className="card">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p className="alert alert-danger">401 Unauthorized: Please log in to view and assign applications.</p>
      </div>
    )
  }

  const handleAssignment = (appId) => {
    setAssignmentMessage('')
    const existingApp = applications.find(app => app.id === appId)

    if (existingApp && existingApp.assignedTo) {
      setAssignmentMessage(`Application ${appId} is already assigned to ${existingApp.assignedTo}.`)
      return
    }

    if (onAssign(appId, selectedOfficer)) {
      setAssignmentMessage(`Application ${appId} assigned to ${selectedOfficer}.`)
      setTimeout(() => setAssignmentMessage(''), 3000)
    }
  }

  const pendingApplications = applications.filter(app => !app.assignedTo || app.status === 'Flagged for Review')

  return (
    <div className="card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      <div className="form-group">
        <label htmlFor="officerSelect">Assign to:</label>
        <select id="officerSelect" value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)}>
          <option value="Loan Officer A">Loan Officer A</option>
          <option value="Underwriter B">Underwriter B</option>
        </select>
      </div>

      {assignmentMessage && <p className="alert alert-info">{assignmentMessage}</p>}

      {pendingApplications.length === 0 ? (
        <p>No pending applications to display.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant</th>
              <th>Loan Type</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingApplications.map(app => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.applicant}</td>
                <td>{app.type}</td>
                <td>{app.status}</td>
                <td>{app.assignedTo || 'Unassigned'}</td>
                <td>
                  <button onClick={() => handleAssignment(app.id)} disabled={app.assignedTo === selectedOfficer}>
                    {app.assignedTo ? 'Reassign' : 'Assign'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ApplicationQueueAssignment