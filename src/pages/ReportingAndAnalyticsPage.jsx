import React, { useState } from 'react'
import PBIBlock from '../components/PBIBlock'
import LoanProcessingReportsFeature from '../features/reporting/LoanProcessingReportsFeature'

const ReportingAndAnalyticsPage = ({ epic }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [metrics, setMetrics] = useState(null)

  const mockMetrics = {
    totalApplications: 150,
    approvedLoans: 100,
    rejectedLoans: 20,
    underReview: 30,
    avgProcessingTime: '3.5 days',
    automationRate: '75%',
    manualInterventions: 38,
    csatScore: '4.2/5'
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
    setTimeout(() => {
      setMetrics(mockMetrics)
    }, 500)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setMetrics(null)
  }

  const handleFetchMetrics = () => {
    if (!isAuthenticated) return
    setMetrics(null)
    setTimeout(() => {
      const noData = Math.random() > 0.8
      if (noData) {
        setMetrics({ message: 'No Data Available for the selected period.' })
      } else {
        setMetrics(mockMetrics)
      }
    }, 1000)
  }

  return (
    <div className="reporting-and-analytics-page">
      <h1>{epic.title}</h1>
      <p>{epic.description}</p>

      <div className="card" style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-muted)' }}>
        <p>Reporting Access: {isAuthenticated ? 'Authorized' : 'Unauthorized'}</p>
        <button onClick={isAuthenticated ? handleLogout : handleLogin}>
          {isAuthenticated ? 'Log Out' : 'Log In as Business Analyst (Mock)'}
        </button>
      </div>

      {epic.userStories.map((story) => (
        <PBIBlock key={story.title} title={story.title} description={story.description} type="user-story">
          {story.component === "LoanProcessingReportsFeature" && (
            <LoanProcessingReportsFeature
              task={story.tasks[0]}
              isAuthenticated={isAuthenticated}
              metrics={metrics}
              onFetchMetrics={handleFetchMetrics}
            />
          )}
        </PBIBlock>
      ))}
    </div>
  )
}

export default ReportingAndAnalyticsPage