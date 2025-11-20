import React, { useState, useEffect } from 'react'
import { useApplications } from '../../context/ApplicationContext'
import { useAuth } from '../../context/AuthContext'
import NotificationDisplay from '../NotificationDisplay'
import LoadingSpinner from '../LoadingSpinner'

function ManualReviewAndOverride({ applicationId, onBack, canOverride }) {
  const { getApplicationById, updateApplicationStatus, simulateCreditCheck } = useApplications()
  const { user, role } = useAuth()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [decision, setDecision] = useState('')
  const [justification, setJustification] = useState('')
  const [decisionError, setDecisionError] = useState('')
  const [processingDecision, setProcessingDecision] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    const app = getApplicationById(applicationId)
    if (app) {
      setApplication(app)
      if (!app.creditScore || app.creditScore === 'API_UNAVAILABLE') {
        initiateCreditCheck(app.id)
      }
    } else {
      setError('Application not found.')
    }
    setLoading(false)
  }, [applicationId, getApplicationById])

  const initiateCreditCheck = async (appId) => {
    console.log('Initiating credit check for app:', appId);
    setLoading(true);
    try {
      await simulateCreditCheck(appId);
      const updatedApp = getApplicationById(appId);
      setApplication(updatedApp);
    } catch (err) {
      setError(err.message || 'Failed to simulate credit check.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecisionSubmit = async () => {
    setDecisionError('')
    if (!decision) {
      setDecisionError('Please select a decision.')
      return
    }
    if (canOverride && decision !== 'under-review' && !justification) {
      setDecisionError('Justification is required for overriding decisions.')
      return
    }

    setProcessingDecision(true)
    try {
      await updateApplicationStatus(
        application.id,
        decision,
        `Decision: ${decision}. ${justification ? 'Justification: ' + justification : ''}`,
        user.id,
        justification
      )
      setDecision('')
      setJustification('')
      setDecisionError('')
      onBack()
    } catch (err) {
      setDecisionError(err.message || 'Failed to update application decision.')
    } finally {
      setProcessingDecision(false)
    }
  }

  const formatTimestamp = (isoString) => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    return date.toLocaleString()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <NotificationDisplay message={error} type="error" />
  }

  if (!application) {
    return <NotificationDisplay message="No application selected for review." type="info" />
  }

  const isFlagged = application.status === 'flagged' || application.documents?.some(doc => doc.status === 'flagged')
  const isCreditScoreWarning = typeof application.creditScore === 'string' && application.creditScore.includes('Incomplete')
  const isCreditApiUnavailable = application.creditScore === 'API_UNAVAILABLE'

  const canApproveOrReject = role === 'underwriter' || application.status === 'under-review' || application.assignedOfficer === user.id

  return (
    <div className="card">
      <h3>Review Application #{application.id.substring(4,10)}</h3>
      {decisionError && <NotificationDisplay message={decisionError} type="error" />}

      <p><strong>Applicant:</strong> {application.applicantName}</p>
      <p><strong>Email:</strong> {application.email}</p>
      <p><strong>Loan Type:</strong> {application.loanType}</p>
      <p><strong>Loan Amount:</strong> MUR {application.amount?.toLocaleString()}</p>
      <p><strong>Current Status:</strong> <span className={`status-badge ${application.status.toLowerCase().replace(' ', '-')}`}>{application.status.replace('-', ' ')}</span></p>
      <p><strong>Submitted On:</strong> {formatTimestamp(application.submittedAt)}</p>
      {application.assignedOfficer && <p><strong>Assigned To:</strong> {application.assignedOfficer}</p>}
      <p><strong>Credit Score:</strong> {application.creditScore !== null ? application.creditScore : 'N/A'}</p>
      {isCreditScoreWarning && <NotificationDisplay message="Credit score data is incomplete, manual verification advised." type="info" />}
      {isCreditApiUnavailable && <NotificationDisplay message="Credit Bureau API was unavailable. Manual credit check is required." type="error" />}

      {isFlagged && <NotificationDisplay message="This application has flagged documents or requires manual review." type="gold" />}

      <h4 style={{ marginTop: '2em', borderTop: '1px solid #f0f0f0', paddingTop: '1em' }}>Uploaded Documents:</h4>
      {application.documents && application.documents.length > 0 ? (
        <ul>
          {application.documents.map((doc, index) => (
            <li key={index}>
              {doc.name} - <span className={`status-badge ${doc.status.toLowerCase().replace(' ', '-')}`}>{doc.status.replace('-', ' ')}</span>
              {doc.message && <span style={{fontSize: '0.9em', marginLeft: '0.5em', color: 'var(--color-muted)'}}>({doc.message})</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents uploaded.</p>
      )}

      {application.overrideJustification && (
        <div style={{ marginTop: '2em', borderTop: '1px solid #f0f0f0', paddingTop: '1em' }}>
          <h4>Override Details:</h4>
          <p><strong>Overridden Decision:</strong> <span className={`status-badge ${application.decisionOverride?.toLowerCase().replace(' ', '-')}`}>{application.decisionOverride?.replace('-', ' ')}</span></p>
          <p><strong>Justification:</strong> {application.overrideJustification}</p>
        </div>
      )}

      {canApproveOrReject && (
        <div style={{ marginTop: '2em', borderTop: '1px solid #f0f0f0', paddingTop: '1em' }}>
          <h4>Make Decision:</h4>
          <div className="form-group">
            <label htmlFor="decision">Decision:</label>
            <select id="decision" value={decision} onChange={(e) => setDecision(e.target.value)} disabled={processingDecision}>
              <option value="">Select Decision</option>
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
              {canOverride && <option value="under-review">Send Back to Under Review</option>}
            </select>
          </div>
          {(decision === 'approved' || decision === 'rejected') && canOverride && (
            <div className="form-group">
              <label htmlFor="justification">Justification (Required for override):</label>
              <textarea
                id="justification"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Provide reason for decision or override..."
                rows="3"
                disabled={processingDecision}
              ></textarea>
            </div>
          )}
          <button onClick={handleDecisionSubmit} disabled={processingDecision || !decision}>
            {processingDecision ? <LoadingSpinner /> : 'Submit Decision'}
          </button>
        </div>
      )}
      {!canApproveOrReject && (
        <NotificationDisplay message="You do not have permission to make a decision on this application, or it's not assigned to you." type="info" />
      )}

      <button onClick={onBack} style={{ marginTop: '2em', backgroundColor: 'var(--color-muted)' }}>Back to Queue</button>
    </div>
  )
}

export default ManualReviewAndOverride