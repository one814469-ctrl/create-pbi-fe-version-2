import React, { useState, useEffect } from 'react'
import { useApplications } from '../context/ApplicationContext'
import { useAuth } from '../context/AuthContext'
import NotificationDisplay from '../components/NotificationDisplay'
import LoadingSpinner from '../components/LoadingSpinner'

function AnalyticsReporting() {
  const { applications } = useApplications()
  const { role } = useAuth()
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (role !== 'analyst') {
      setError('You do not have permission to view reporting and analytics.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const totalApplications = applications.length
      const approvedApplications = applications.filter(app => app.status === 'approved').length
      const rejectedApplications = applications.filter(app => app.status === 'rejected').length
      const underReviewApplications = applications.filter(app => app.status === 'under-review' || app.status === 'submitted' || app.status === 'assigned' || app.status === 'flagged' || app.status === 'verified-documents').length

      const getProcessingTime = (app) => {
        if (!app.submittedAt || (app.status !== 'approved' && app.status !== 'rejected')) {
          return null
        }
        const submitted = new Date(app.submittedAt)
        const finalUpdate = app.updates.find(u => u.status === 'approved' || u.status === 'rejected')
        if (!finalUpdate) return null
        const completed = new Date(finalUpdate.timestamp)
        return (completed.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24) // Days
      }

      const processingTimes = applications
        .map(getProcessingTime)
        .filter(time => time !== null)

      const averageProcessingTime = processingTimes.length > 0
        ? (processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length).toFixed(2)
        : 'N/A'

      const automatedVerificationRate = applications.length > 0
        ? ((applications.filter(app => app.documents.some(doc => doc.status === 'verified')).length / applications.length) * 100).toFixed(2)
        : 'N/A'

      const manualInterventionRate = applications.length > 0
        ? ((applications.filter(app => app.documents.some(doc => doc.status === 'flagged') || app.creditScore === 'API_UNAVAILABLE' || app.decisionOverride).length / applications.length) * 100).toFixed(2)
        : 'N/A'

      const csatScore = applications.length > 0
        ? (Math.random() * (5 - 3.5) + 3.5).toFixed(1) // Simulate CSAT between 3.5 and 5
        : 'N/A'

      setMetrics({
        totalApplications,
        approvedApplications,
        rejectedApplications,
        underReviewApplications,
        averageProcessingTime,
        automatedVerificationRate,
        manualInterventionRate,
        csatScore,
        allApplications: applications
      })
    } catch (err) {
      setError('Failed to load analytics data.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [applications, role])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <NotificationDisplay message={error} type="error" />
  }

  if (!metrics) {
    return (
      <div className="container">
        <h3>Loan Processing Reports</h3>
        <NotificationDisplay message="No data available for reporting." type="info" />
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Loan Processing Reports</h2>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Applications</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{metrics.totalApplications}</p>
        </div>
        <div className="card">
          <h3>Approved Loans</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#28a745' }}>{metrics.approvedApplications}</p>
        </div>
        <div className="card">
          <h3>Rejected Loans</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#dc3545' }}>{metrics.rejectedApplications}</p>
        </div>
        <div className="card">
          <h3>Under Review</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--color-accent)' }}>{metrics.underReviewApplications}</p>
        </div>
        <div className="card">
          <h3>Avg. Processing Time</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{metrics.averageProcessingTime} Days</p>
        </div>
        <div className="card">
          <h3>Automated Verification Rate</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{metrics.automatedVerificationRate}%</p>
        </div>
        <div className="card">
          <h3>Manual Intervention Rate</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{metrics.manualInterventionRate}%</p>
        </div>
        <div className="card">
          <h3>Customer Satisfaction (CSAT)</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--color-gold)' }}>{metrics.csatScore} / 5</p>
        </div>
      </div>

      <h3 style={{ marginTop: '3em' }}>All Applications Data</h3>
      {metrics.allApplications.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>App ID</th>
                <th>Applicant</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Processing Time (Days)</th>
                <th>Credit Score</th>
                <th>Manual Override</th>
              </tr>
            </thead>
            <tbody>
              {metrics.allApplications.map((app) => (
                <tr key={app.id}>
                  <td>#{app.id.substring(4,10)}</td>
                  <td>{app.applicantName}</td>
                  <td>{app.loanType}</td>
                  <td>{app.amount?.toLocaleString()}</td>
                  <td><span className={`status-badge ${app.status.toLowerCase().replace(' ', '-')}`}>{app.status.replace('-', ' ')}</span></td>
                  <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                  <td>
                    {app.status === 'approved' || app.status === 'rejected'
                      ? ((new Date(app.updates.find(u => u.status === 'approved' || u.status === 'rejected')?.timestamp).getTime() - new Date(app.submittedAt).getTime()) / (1000 * 60 * 60 * 24)).toFixed(2)
                      : 'N/A'}
                  </td>
                  <td>{app.creditScore || 'N/A'}</td>
                  <td>{app.decisionOverride ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <NotificationDisplay message="No detailed application data to display." type="info" />
      )}
    </div>
  )
}

export default AnalyticsReporting