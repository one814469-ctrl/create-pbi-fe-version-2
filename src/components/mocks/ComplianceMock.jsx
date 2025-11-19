import React, { useState } from 'react';
import Button from '../ui/Button';

const ComplianceMock = ({ onUpdateApplication }) => {
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runComplianceCheck = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const isCompliant = Math.random() > 0.2; // 80% chance of compliance
      setComplianceStatus(isCompliant ? 'Compliant' : 'Non-compliant: Missing specific regulatory document.');
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
        <div className="mock-api-response mt-4">
          <h5>Compliance Result:</h5>
          <p style={{ color: complianceStatus.startsWith('Compliant') ? '#6bff6b' : '#ff6b6b' }}>
            {complianceStatus}
          </p>
          {complianceStatus.startsWith('Non-compliant') && (
            <p className="error-message">
              <em>Edge Case: "Approval only proceeds if application is compliant" (Mocked: Approval blocked)</em>
            </p>
          )}
        </div>
      )}
      <p className="mt-4"><em>Acceptance Criteria: "Given a loan application is ready for approval, When compliance rules are applied, Then approval only proceeds if application is compliant" (Mocked)</em></p>
    </div>
  );
};

export default ComplianceMock;