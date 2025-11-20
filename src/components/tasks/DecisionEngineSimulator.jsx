import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';

const DecisionEngineSimulator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplication, addNotification } = useLoan();
  const [applicationId, setApplicationId] = useState('');
  const [decisionResult, setDecisionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter' && user?.role !== 'manager')) {
    displayMessage('error', 'Access denied. You need appropriate permissions to simulate the decision engine.');
    return (
      <p className="error-message">
        Access Denied: Only loan officers, underwriters, and managers can simulate the decision engine.
      </p>
    );
  }

  const handleSimulateDecision = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      displayMessage('error', 'Please enter an Application ID.');
      return;
    }

    setLoading(true);
    setDecisionResult(null);

    // Get the current application state for criteria checking
    const app = applications.find(a => a.id === applicationId);

    // Simulate decision engine processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let outcome = 'Pending';
    let reason = 'Processing...';

    if (!app) {
      outcome = 'Error';
      reason = 'Application not found.';
      displayMessage('error', reason);
    } else if (app.status === 'Approved' || app.status === 'Rejected') {
      outcome = app.status;
      reason = `Application already ${app.status}.`;
      displayMessage('info', reason);
    } else {
      // Mock Business Rules for Auto-Approval/Rejection
      const meetsApprovalCriteria = app.creditScore && app.creditScore >= 700 &&
                                    app.documentVerificationStatus === 'Verified' &&
                                    app.complianceStatus !== 'Non-Compliant' &&
                                    app.amount <= 50000; // Example: Max auto-approval amount

      const meetsRejectionCriteria = app.creditScore && app.creditScore < 600;

      if (meetsApprovalCriteria) {
        outcome = 'Approved';
        reason = 'All criteria met for auto-approval.';
        displayMessage('success', `Application ${applicationId} auto-approved.`);
        addNotification({
          id: `NOTIF-${Date.now()}`, userId: app.customerID, type: 'status_update',
          message: `Congratulations! Your application ${app.id} has been Approved.`, read: false, timestamp: new Date().toISOString()
        });
      } else if (meetsRejectionCriteria) {
        outcome = 'Rejected';
        reason = 'Credit score below minimum threshold.';
        displayMessage('error', `Application ${applicationId} auto-rejected.`);
        addNotification({
          id: `NOTIF-${Date.now()}`, userId: app.customerID, type: 'status_update',
          message: `Your application ${app.id} has been Rejected. Reason: Credit Score Below Threshold.`, read: false, timestamp: new Date().toISOString()
        });
      } else {
        // Acceptance Criteria: [Edge] Given an application is flagged for manual review
        outcome = 'Manual Review Required';
        reason = 'Exceptions or missing data, routed to loan officer for review.';
        displayMessage('info', `Application ${applicationId} requires manual review.`);
        addNotification({
          id: `NOTIF-${Date.now()}`, userId: 'officer_tasks', type: 'reminder',
          message: `Urgent: Application ${app.id} requires manual review.`, read: false, timestamp: new Date().toISOString()
        });
      }
    }

    setDecisionResult({ id: applicationId, outcome, reason });
    if (app && outcome !== 'Error' && outcome !== 'Pending') {
      updateApplication(applicationId, {
        status: outcome,
        approvalStatus: outcome,
        auditTrail: [
          ...(app.auditTrail || []),
          { timestamp: new Date().toISOString(), user: 'Decision Engine', action: `Decision: ${outcome} (${reason})` }
        ]
      });
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-card">
      <h5>Automated Decision Engine</h5>
      <form onSubmit={handleSimulateDecision}>
        <div className="form-group">
          <label htmlFor="decisionAppId">Application ID:</label>
          <input
            type="text"
            id="decisionAppId"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="e.g., LA001, LA002, LA004"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Simulate Decision'}
          </button>
        </div>
      </form>

      {decisionResult && (
        <div style={{ marginTop: '1.5rem' }}>
          <h6>Decision for Application {decisionResult.id}:</h6>
          <p className={decisionResult.outcome === 'Approved' ? 'success-message' : decisionResult.outcome === 'Rejected' ? 'error-message' : 'info-message'}>
            Outcome: <strong>{decisionResult.outcome}</strong>
          </p>
          <p>Reason: {decisionResult.reason}</p>
          {/* Acceptance Criteria: [Negative] Given a rejected application */}
          {decisionResult.outcome === 'Rejected' && (
            <p className="info-message">
              For rejected applications, applicants are shown clear rejection reasons and appeal instructions.
              (e.g., "You may appeal this decision by contacting FinTrust customer service within 30 days.")
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionEngineSimulator;