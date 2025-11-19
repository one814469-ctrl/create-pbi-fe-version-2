import React, { useState } from 'react';
import Button from '../ui/Button';

const DecisionEngineMock = ({ onUpdateApplication, task }) => {
  const [decision, setDecision] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDecisionEngine = () => {
    setIsLoading(true);
    setTimeout(() => {
      const isApproved = Math.random() > 0.3;
      let newDecisionStatus;
      let reason;
      let isManualReview = false;

      if (isApproved) {
        newDecisionStatus = 'Approved';
        reason = 'Meets all automated criteria.';
      } else {
        if (Math.random() > 0.5) {
          newDecisionStatus = 'Rejected';
          reason = 'Credit score below threshold, high DTI.';
        } else {
          newDecisionStatus = 'Flagged for Manual Review';
          reason = 'Exceptions detected (e.g., unusual income pattern, specific risk factor).';
          isManualReview = true;
        }
      }

      setDecision({ status: newDecisionStatus, reason, isManualReview });
      onUpdateApplication && onUpdateApplication(prev => ({
        ...prev,
        decision: newDecisionStatus,
        history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: `Automated Decision: ${newDecisionStatus}` }]
      }));
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="decision-engine-mock">
      <h4>Automatic Loan Approval/Rejection</h4>
      <p>Simulates the automated decision engine applying business rules.</p>
      <Button onClick={runDecisionEngine} disabled={isLoading} className="button-secondary">
        {isLoading ? 'Processing...' : 'Run Decision Engine'}
      </Button>
      {decision && (
        <div className={`mock-api-response mt-4 ${decision.status === 'Approved' ? 'success' : (decision.status === 'Rejected' ? 'error' : 'info')}`}>
          <h5>Automated Decision:</h5>
          <p><strong>Status:</strong> {decision.status}</p>
          <p><strong>Reason:</strong> {decision.reason}</p>
          {decision.status === 'Approved' && task && task.acceptance_criteria[0] && (
            <p className="success-message mt-2">
              <em>Acceptance Criteria (Positive): {task.acceptance_criteria[0]} (Mocked: Auto-approved and applicant notified)</em>
            </p>
          )}
          {decision.isManualReview && task && task.acceptance_criteria[1] && (
            <p className="info-message mt-2">
              <em>Acceptance Criteria (Edge): {task.acceptance_criteria[1]} (Mocked: Application routed to loan officer)</em>
            </p>
          )}
          {decision.status === 'Rejected' && task && task.acceptance_criteria[2] && (
            <p className="error-message mt-2">
              <em>Acceptance Criteria (Negative): {task.acceptance_criteria[2]} (Mocked: Clear rejection reasons shown)</em>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionEngineMock;