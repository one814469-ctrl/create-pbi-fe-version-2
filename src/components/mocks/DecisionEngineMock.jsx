import React, { useState } from 'react';
import Button from '../ui/Button';

const DecisionEngineMock = ({ onUpdateApplication }) => {
  const [decision, setDecision] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDecisionEngine = () => {
    setIsLoading(true);
    // Simulate automated decision based on some criteria (e.g., random)
    setTimeout(() => {
      const isApproved = Math.random() > 0.3; // 70% chance of approval
      const newDecision = isApproved ? 'Approved' : 'Rejected';
      const reason = isApproved ? 'Meets all automated criteria.' : 'Credit score below threshold, high DTI.';

      setDecision({ status: newDecision, reason });
      onUpdateApplication && onUpdateApplication(prev => ({
        ...prev,
        decision: newDecision,
        history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: `Automated Decision: ${newDecision}` }]
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
        <div className="mock-api-response mt-4">
          <h5>Automated Decision:</h5>
          <p style={{ color: decision.status === 'Approved' ? '#6bff6b' : '#ff6b6b' }}>
            <strong>Status:</strong> {decision.status}
          </p>
          <p><strong>Reason:</strong> {decision.reason}</p>
          {decision.status === 'Approved' && (
            <p className="success-message"><em>Acceptance Criteria: "Given an application meets all automated criteria, When it is processed by the engine, Then it is auto-approved and applicant notified" (Mocked)</em></p>
          )}
          {decision.status === 'Rejected' && (
            <p className="error-message"><em>Negative Case: "Given a rejected application, When the applicant views their status, Then clear rejection reasons and appeal instructions are shown" (Mocked)</em></p>
          )}
          {decision.status === 'Rejected' && Math.random() > 0.5 && ( // Simulate edge for manual review
             <p className="info-message"><em>Edge Case (simulated): "Given an application is flagged for manual review due to exceptions, When processing occurs, Then it is routed to a loan officer for review and logged"</em></p>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionEngineMock;