import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { useNotification } from '../common/Notification';
import { simulateComplianceCheck } from '../../utils/api';
import '../../styles/Compliance.css';

function ComplianceValidationDisplay() {
  const [applicationId, setApplicationId] = useState('');
  const [complianceResult, setComplianceResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();

  const handleRunComplianceCheck = async () => {
    setError('');
    setComplianceResult(null);

    if (!applicationId.trim()) {
      setError('Application ID is required.');
      showNotification('Application ID is required to run compliance check.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await simulateComplianceCheck(applicationId);
      setComplianceResult(result);
      if (result.isCompliant) {
        showNotification(`Application ${applicationId} is compliant!`, 'success');
      } else {
        showNotification(`Application ${applicationId} is NOT compliant.`, 'error');
      }
    } catch (err) {
      setError(err.message);
      showNotification(`Compliance check failed: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComplianceRule = () => {
    showNotification('Simulating update of compliance rules. New applications will use updated rules.', 'info');
  };

  return (
    <Card title="Automated Compliance Validation">
      <p>As a system, I want to check loan applications against regulatory rules so that approvals remain compliant.</p>
      <div className="compliance-container">
        <Input
          label="Application ID for Compliance Check"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
          placeholder="Enter application ID"
          error={error}
        />
        <Button onClick={handleRunComplianceCheck} disabled={isLoading}>
          {isLoading ? 'Running Checks...' : 'Run Compliance Check'}
        </Button>
        <Button onClick={handleUpdateComplianceRule} variant="secondary">
          Simulate Rule Update
        </Button>

        {complianceResult && (
          <div className={`compliance-results card compliance-${complianceResult.isCompliant ? 'compliant' : 'non-compliant'}`}>
            <h4>Compliance Report for Application ID: {applicationId}</h4>
            <p><strong>Status:</strong> <span className="status-text">{complianceResult.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}</span></p>
            {!complianceResult.isCompliant && (
              <div className="non-compliant-details">
                <p className="error-message"><strong>Reasons for non-compliance:</strong></p>
                <ul>
                  {complianceResult.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
                <p>Approval cannot proceed until compliance issues are resolved.</p>
              </div>
            )}
            {complianceResult.isCompliant && (
              <p className="success-message">Application meets all regulatory requirements. Approval can proceed.</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default ComplianceValidationDisplay;