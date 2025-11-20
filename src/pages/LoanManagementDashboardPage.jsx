import React, { useState } from 'react'
import PBIBlock from '../components/PBIBlock'
import ApplicationQueueAssignment from '../features/loan-management/ApplicationQueueAssignment'
import ManualReviewOverride from '../features/loan-management/ManualReviewOverride'

const LoanManagementDashboardPage = ({ epic }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasOverridePermissions, setHasOverridePermissions] = useState(false)

  const mockApplications = [
    { id: 'APP001', applicant: 'John Doe', type: 'Personal Loan', status: 'Pending Review', assignedTo: null, flagged: false },
    { id: 'APP002', applicant: 'Jane Smith', type: 'Home Loan', status: 'Pending Review', assignedTo: 'Loan Officer A', flagged: false },
    { id: 'APP003', applicant: 'Peter Jones', type: 'Personal Loan', status: 'Flagged for Review', assignedTo: null, flagged: true },
    { id: 'APP004', applicant: 'Alice Brown', type: 'Home Loan', status: 'Approved (Override)', assignedTo: 'Underwriter B', flagged: false }
  ]
  const [applications, setApplications] = useState(mockApplications)

  const handleLogin = () => {
    setIsAuthenticated(true)
    setHasOverridePermissions(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setHasOverridePermissions(false)
  }

  const handleAssign = (appId, officer) => {
    setApplications(prev => prev.map(app =>
      app.id === appId ? { ...app, assignedTo: officer, status: 'Assigned' } : app
    ))
    return true
  }

  const handleOverride = (appId, newStatus, justification) => {
    setApplications(prev => prev.map(app =>
      app.id === appId ? { ...app, status: `${newStatus} (Override)`, justification, flagged: false } : app
    ))
    return true
  }

  return (
    <div className="loan-management-dashboard-page">
      <h1>{epic.title}</h1>
      <p>{epic.description}</p>

      <div className="card" style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-muted)' }}>
        <p>Dashboard Access: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
        <p>Override Permissions: {hasOverridePermissions ? 'Granted' : 'Denied'}</p>
        <button onClick={isAuthenticated ? handleLogout : handleLogin}>
          {isAuthenticated ? 'Log Out' : 'Log In as Underwriter (Mock)'}
        </button>
      </div>

      {epic.userStories.map((story) => (
        <PBIBlock key={story.title} title={story.title} description={story.description} type="user-story">
          {story.component === "ApplicationQueueAssignment" && (
            <ApplicationQueueAssignment
              task={story.tasks[0]}
              isAuthenticated={isAuthenticated}
              applications={applications}
              onAssign={handleAssign}
            />
          )}
          {story.component === "ManualReviewOverride" && (
            <ManualReviewOverride
              task={story.tasks[0]}
              isAuthenticated={isAuthenticated}
              hasOverridePermissions={hasOverridePermissions}
              applications={applications}
              onOverride={handleOverride}
            />
          )}
        </PBIBlock>
      ))}
    </div>
  )
}

export default LoanManagementDashboardPage