import React, { useState } from 'react'
import PBIBlock from '../components/PBIBlock'
import ApplicationFormSubmission from '../features/loan-application/ApplicationFormSubmission'
import DocumentUploadVerification from '../features/loan-application/DocumentUploadVerification'
import ApplicationStatusTracking from '../features/loan-application/ApplicationStatusTracking'

const LoanApplicationPortalPage = ({ epic }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [applicationId, setApplicationId] = useState(null)
  const [statusUpdates, setStatusUpdates] = useState([])

  const handleLoginToggle = () => setIsLoggedIn(!isLoggedIn)

  const handleApplicationSubmit = (id) => {
    setApplicationId(id)
    const newStatus = { id, status: 'Submitted', timestamp: new Date().toLocaleString() }
    setStatusUpdates(prev => [...prev, newStatus])
    console.log('Application submitted, ID:', id)
  }

  const handleDocumentUpload = (appId, docName, verificationStatus) => {
    setStatusUpdates(prev =>
      prev.map(app =>
        app.id === appId
          ? { ...app, documents: [...(app.documents || []), { name: docName, verificationStatus }], status: 'Under Review', timestamp: new Date().toLocaleString() }
          : app
      )
    )
    console.log(`Document ${docName} uploaded for application ${appId} with status ${verificationStatus}`)
  }

  const handleStatusUpdate = (appId, newStatus) => {
    setStatusUpdates(prev =>
      prev.map(app =>
        app.id === appId
          ? { ...app, status: newStatus, timestamp: new Date().toLocaleString() }
          : app
      )
    )
  }

  return (
    <div className="loan-application-portal-page">
      <h1>{epic.title}</h1>
      <p>{epic.description}</p>

      <div className="card" style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-muted)' }}>
        <p>Current User Status: {isLoggedIn ? 'Logged In' : 'Logged Out'}</p>
        <button onClick={handleLoginToggle}>
          {isLoggedIn ? 'Log Out' : 'Log In (Mock)'}
        </button>
      </div>

      {epic.userStories.map((story) => (
        <PBIBlock key={story.title} title={story.title} description={story.description} type="user-story">
          {story.component === "ApplicationFormSubmission" && (
            <ApplicationFormSubmission
              task={story.tasks[0]}
              onApplicationSubmit={handleApplicationSubmit}
              isLoggedIn={isLoggedIn}
            />
          )}
          {story.component === "DocumentUploadVerification" && applicationId && (
            <DocumentUploadVerification
              task={story.tasks[0]}
              applicationId={applicationId}
              onDocumentUpload={handleDocumentUpload}
            />
          )}
          {story.component === "ApplicationStatusTracking" && (
            <ApplicationStatusTracking
              task={story.tasks[0]}
              isLoggedIn={isLoggedIn}
              applicationUpdates={statusUpdates}
              applicationId={applicationId}
            />
          )}
        </PBIBlock>
      ))}
    </div>
  )
}

export default LoanApplicationPortalPage