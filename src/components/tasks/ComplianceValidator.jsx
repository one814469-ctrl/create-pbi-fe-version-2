import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ComplianceValidator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const [applicationId, setApplicationId] = useState('');
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter' && user?.role !== 'manager')) {
    displayMessage('error', 'Access denied. You need appropriate permissions to simulate compliance checks.');
    return (
      <p className="error-message">
        Access Denied: Only loan officers, underwriters, and managers can trigger compliance validation.
      </p>
    );
  }

  const handleValidateCompliance = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      displayMessage('error', 'Please enter an Application ID.');
      return;
    }

    setLoading(true);
    setComplianceStatus(null);

    // Simulate compliance check API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Acceptance Criteria: Given a loan application is ready for approval
    // Then approval only proceeds if application is compliant
    // Mock logic: randomly pass/fail, or based on specific IDs for demo
    const isCompliant = applicationId === 'LA002' || Math.random() > 0.3; // LA002 is always compliant
    setComplianceStatus({
      id: applicationId,
      compliant: isCompliant,
      reason: isCompliant ? 'All regulatory rules met.' : 'Potential issue: KYC document expiry detected.',
    });

    if (isCompliant) {
      displayMessage('success', `Application ${applicationId} is compliant.`);
    } else {
      displayMessage('error', `Application ${applicationId} failed compliance check.`);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-card">
      <h5>Automated Compliance Validation</h5>
      <form onSubmit={handleValidateCompliance}>
        <div className="form-group">
          <label htmlFor="complianceAppId">Application ID:</label>
          <input
            type="text"
            id="complianceAppId"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="e.g., LA001, LA002"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Validating...' : 'Run Compliance Check'}
          </button>
        </div>
      </form>

      {complianceStatus && (
        <div style={{ marginTop: '1.5rem' }}>
          <h6>Result for Application {complianceStatus.id}:</h6>
          <p className={complianceStatus.compliant ? 'success-message' : 'error-message'}>
            Status: <strong>{complianceStatus.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}</strong>
          </p>
          <p>Reason: {complianceStatus.reason}</p>
          {/* Acceptance Criteria: [Edge] Given a compliance rule is updated */}
          <p className="info-message">
            (Mocked: Imagine updated rules would apply to new checks.)
          </p>
        </div>
      )}
    </div>
  );
};

export default ComplianceValidator;