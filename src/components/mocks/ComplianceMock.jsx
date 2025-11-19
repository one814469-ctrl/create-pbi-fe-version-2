import React, { useState } from 'react';
import Button from '../ui/Button';

const ComplianceMock = ({ onUpdateApplication, task }) => {
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runComplianceCheck = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const isCompliant = Math.random() > 0.2; // 80% chance of compliance
      const statusMessage = isCompliant ? 'Compliant' : 'Non-compliant: Missing specific regulatory document, or rule violation detected.';
      setComplianceStatus(statusMessage);
      onUpdateApplication && onUpdateApplication(prev => ({
        ...prev,
        compliance: isCompliant ? 'Compliant' : 'Non-compliant',
        history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: `Compliance Check: ${isCompliant ? 'Passed' : 'Failed'}` }]
      }));
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="compliance-check-mock">
      <h4>Automated Compliance Validation</h4>
      <p>Simulates checking the loan application against regulatory rules.</p>
      <Button onClick={runComplianceCheck} disabled={isLoading} className="button-secondary">
        {isLoading ? 'Checking...' : 'Run Compliance Check'}
      </Button>
      {complianceStatus && (
        <div className={`mock-api-response mt-4 ${complianceStatus.startsWith('Compliant') ? 'success' : 'error'}`}>
          <h5>Compliance Result:</h5>
          <p>{complianceStatus}</p>
          <p className="mt-2">
            <em>Acceptance Criteria (Positive): {task.acceptance_criteria[0]} (Mocked: Approval proceeds if compliant, otherwise blocked)</em>
          </p>
          <p className="mt-2 info-message">
            <em>Acceptance Criteria (Edge): {task.acceptance_criteria[1]} (Mocked: Assumes a rule update would trigger re-evaluation)</em>
          </p>
        </div>
      )}
    </div>
  );
};

export default ComplianceMock;