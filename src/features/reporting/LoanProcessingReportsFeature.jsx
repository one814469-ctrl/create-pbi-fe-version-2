import React from 'react'

const LoanProcessingReportsFeature = ({ task, isAuthenticated, metrics, onFetchMetrics }) => {
  if (!isAuthenticated) {
    return (
      <div className="card">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p className="alert alert-danger">401 Unauthorized: Access denied. Please log in to view reports.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      <button onClick={onFetchMetrics}>Refresh Metrics</button>

      {metrics ? (
        metrics.message ? (
          <p className="alert alert-info" style={{ marginTop: '20px' }}>{metrics.message}</p>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <div className="card" style={{ backgroundColor: 'var(--color-bg)' }}>
              <h5>Overall Loan Processing Metrics:</h5>
              <table>
                <tbody>
                  <tr><td>Total Applications:</td><td>{metrics.totalApplications}</td></tr>
                  <tr><td>Approved Loans:</td><td>{metrics.approvedLoans}</td></tr>
                  <tr><td>Rejected Loans:</td><td>{metrics.rejectedLoans}</td></tr>
                  <tr><td>Under Review:</td><td>{metrics.underReview}</td></tr>
                  <tr><td>Average Processing Time:</td><td>{metrics.avgProcessingTime}</td></tr>
                  <tr><td>Automation Rate:</td><td>{metrics.automationRate}</td></tr>
                  <tr><td>Manual Interventions:</td><td>{metrics.manualInterventions}</td></tr>
                  <tr><td>CSAT Score:</td><td>{metrics.csatScore}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="success-message">Metrics updated: {new Date().toLocaleString()}</p>
          </div>
        )
      ) : (
        <p className="alert alert-info" style={{ marginTop: '20px' }}>Loading metrics or no data fetched yet. Click 'Refresh Metrics'.</p>
      )}
    </div>
  )
}

export default LoanProcessingReportsFeature