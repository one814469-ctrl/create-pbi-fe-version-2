import React, { useState } from 'react'
import ApplicationQueue from '../components/officer/ApplicationQueue'
import ManualReviewAndOverride from '../components/officer/ManualReviewAndOverride'
import { useAuth } from '../context/AuthContext'
import NotificationDisplay from '../components/NotificationDisplay'

function OfficerDashboard() {
  const [selectedApplicationId, setSelectedApplicationId] = useState(null)
  const [view, setView] = useState('queue')
  const { role } = useAuth()

  const handleSelectApplication = (appId) => {
    setSelectedApplicationId(appId)
    setView('review')
  }

  const handleBackToQueue = () => {
    setSelectedApplicationId(null)
    setView('queue')
  }

  if (role !== 'officer' && role !== 'underwriter') {
    return <NotificationDisplay message="You do not have permission to access the officer dashboard." type="error" />
  }

  return (
    <div className="container">
      <h2>Loan Management Dashboard ({role === 'officer' ? 'Loan Officer' : 'Underwriter'})</h2>

      <div style={{ display: 'flex', gap: '1em', marginBottom: '2em', justifyContent: 'center' }}>
        <button onClick={() => setView('queue')} className={view === 'queue' ? 'active' : ''}>Application Queue</button>
        {selectedApplicationId && (
          <button onClick={() => setView('review')} className={view === 'review' ? 'active' : ''}>Review Application</button>
        )}
      </div>

      {view === 'queue' && (
        <ApplicationQueue onSelectApplication={handleSelectApplication} />
      )}

      {view === 'review' && selectedApplicationId && (
        <ManualReviewAndOverride
          applicationId={selectedApplicationId}
          onBack={handleBackToQueue}
          canOverride={role === 'underwriter'}
        />
      )}

      {view === 'review' && !selectedApplicationId && (
        <NotificationDisplay message="Select an application from the queue to review." type="info" />
      )}
    </div>
  )
}

export default OfficerDashboard