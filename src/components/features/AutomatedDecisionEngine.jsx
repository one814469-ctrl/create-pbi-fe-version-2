import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { useNotification } from '../common/Notification';
import { simulateAutomatedDecision } from '../../utils/api';
import '../../styles/DecisionEngine.css';

function AutomatedDecisionEngine() {
  const [applicationId, setApplicationId] = useState('');
  const [decisionResult, setDecisionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();

  const handleProcessApplication = async () => {
    setError('');
    setDecisionResult(null);

    if (!applicationId.trim()) {
      setError('Application ID is required.');
      showNotification('Application ID is required to process decision.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await simulateAutomatedDecision(applicationId);
      setDecisionResult(result);
      showNotification(`Application ${applicationId} ${result.decision}!`, result.decision === 'Approved' ? 'success' : 'error');
    } catch (err) {
      setError(err.message);
      showNotification(`Decision processing failed: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Automatic Loan Approval/Rejection based on Criteria">
      <p>As a system, I want loan applications auto-approved or rejected using set business rules so that outcomes are consistent and timely.</p>
      <div className="decision-engine-container">
        <Input
          label="Application ID to Process"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
          placeholder="Enter application ID"
          error={error}
        />
        <Button onClick={handleProcessApplication} disabled={isLoading}>
          {isLoading ? 'Processing Decision...' : 'Process Application Decision'}
        </Button>

        {decisionResult && (
          <div className={`decision-results card decision-${decisionResult.decision.toLowerCase()}`}>
            <h4>Decision for Application ID: {applicationId}</h4>
            <p><strong>Decision:</strong> <span className="decision-text">{decisionResult.decision}</span></p>
            {decisionResult.decision === 'Rejected' && (
              <p className="error-message"><strong>Reason:</strong> {decisionResult.rejectionReason}</p>
            )}
            {decisionResult.decision === 'Escalated' && (
              <div className="escalation-details">
                <p className="warning-message"><strong>Escalated for Manual Review:</strong> {decisionResult.escalationReason}</p>
                <p>Routed to a loan officer for review and logged for audit.</p>
              </div>
            )}
            {decisionResult.decision === 'Approved' && (
              <p className="success-message">Applicant notified of approval.</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default AutomatedDecisionEngine;