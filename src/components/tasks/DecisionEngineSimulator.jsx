import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';

const DecisionEngineSimulator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplication, addNotification } = useLoan();
  const [applicationId, setApplicationId] = useState('');
  const [decisionResult, setDecisionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter' && user?.role !== 'manager')) {
    displayMessage('error', 'Access Denied', 'You need appropriate permissions to simulate the decision engine.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Automated Decision Engine</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only loan officers, underwriters, and managers can simulate the decision engine.</p>
        </div>
      </div>
    );
  }

  const handleSimulateDecision = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      displayMessage('error', 'Validation Error', 'Please enter an Application ID.');
      return;
    }

    setLoading(true);
    setDecisionResult(null);

    const app = applications.find(a => a.id === applicationId);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let outcome = 'Pending';
    let reason = 'Processing...';

    if (!app) {
      outcome = 'Error';
      reason = 'Application not found.';
      displayMessage('error', 'Decision Failed', reason);
    } else if (app.status.includes('Approved') || app.status.includes('Rejected')) {
      outcome = app.status.includes('Approved') ? 'Approved' : 'Rejected';
      reason = `Application already ${outcome.toLowerCase()}.`;
      displayMessage('info', 'Decision Status', reason);
    } else {
      const meetsApprovalCriteria = app.creditScore && app.creditScore >= 700 &&
                                    app.documentVerificationStatus === 'Verified' &&
                                    app.complianceStatus !== 'Non-Compliant' &&
                                    app.amount <= 50000;

      const meetsRejectionCriteria = app.creditScore && app.creditScore < 600;

      if (meetsApprovalCriteria) {
        outcome = 'Approved';
        reason = 'All criteria met for auto-approval.';
        displayMessage('success', 'Application Approved', `Application ${applicationId} auto-approved.`);
        addNotification({
          id: `NOTIF-${Date.now()}`, userId: app.customerID, type: 'status_update',
          message: `Congratulations! Your application ${app.id} has been Approved.`, read: false, timestamp: new Date().toISOString()
        });
      } else if (meetsRejectionCriteria) {
        outcome = 'Rejected';
        reason = 'Credit score below minimum threshold.';
        displayMessage('error', 'Application Rejected', `Application ${applicationId} auto-rejected.`);
        addNotification({
          id: `NOTIF-${Date.now()}`, userId: app.customerID, type: 'status_update',
          message: `Your application ${app.id} has been Rejected. Reason: Credit Score Below Threshold.`, read: false, timestamp: new Date().toISOString()
        });
      } else {
        outcome = 'Manual Review Required (Decision)';
        reason = 'Exceptions or missing data, routed to loan officer for review.';
        displayMessage('info', 'Manual Review Needed', `Application ${applicationId} requires manual review.`);
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

  const getDecisionBadgeClass = (outcome) => {
    if (outcome === 'Approved') return 'badge-default';
    if (outcome === 'Rejected') return 'badge-destructive';
    return 'badge-secondary';
  };

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">Automated Decision Engine</h3>
        <p className="card-description">Apply business logic and compliance checks to trigger automated approvals or escalations.</p>
      </div>
      <div className="card-content space-y-6">
        <form onSubmit={handleSimulateDecision} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="decisionAppId" className="block text-sm font-medium">Application ID</label>
            <input
              id="decisionAppId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g., LA001, LA002, LA004"
              disabled={loading}
              className="w-full"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Simulate Decision'}
          </button>
        </form>

        {decisionResult && (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Decision for Application {decisionResult.id}:</h6>
            <span className={`badge ${getDecisionBadgeClass(decisionResult.outcome)}`}>
              Outcome: {decisionResult.outcome}
            </span>
            <p className="text-muted-foreground">Reason: {decisionResult.reason}</p>
            {decisionResult.outcome === 'Rejected' && (
              <p className="text-sm text-muted-foreground italic">
                For rejected applications, applicants are shown clear rejection reasons and appeal instructions.
                (e.g., "You may appeal this decision by contacting FinTrust customer service within 30 days.")
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionEngineSimulator;