import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const ComplianceValidator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const [applicationId, setApplicationId] = useState('');
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter' && user?.role !== 'manager')) {
    displayMessage('error', 'Access Denied', 'You need appropriate permissions to simulate compliance checks.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Automated Compliance Validation</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only loan officers, underwriters, and managers can trigger compliance validation.</p>
        </div>
      </div>
    );
  }

  const handleValidateCompliance = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      displayMessage('error', 'Validation Error', 'Please enter an Application ID.');
      return;
    }

    setLoading(true);
    setComplianceStatus(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isCompliant = applicationId === 'LA002' || Math.random() > 0.3;
    setComplianceStatus({
      id: applicationId,
      compliant: isCompliant,
      reason: isCompliant ? 'All regulatory rules met for approval.' : 'Potential issue: KYC document expiry detected. Manual review required.',
    });

    if (isCompliant) {
      displayMessage('success', 'Compliance Check', `Application ${applicationId} is compliant. Approval can proceed.`);
    } else {
      displayMessage('error', 'Compliance Check', `Application ${applicationId} failed compliance check. Manual review needed.`);
    }
    setLoading(false);
  };

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">Automated Compliance Validation</h3>
        <p className="card-description">Check loan applications against regulatory rules for compliance.</p>
      </div>
      <div className="card-content space-y-6">
        <form onSubmit={handleValidateCompliance} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="complianceAppId" className="block text-sm font-medium">Application ID</label>
            <input
              id="complianceAppId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g., LA001, LA002"
              disabled={loading}
              className="w-full"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Validating...' : 'Run Compliance Check'}
          </button>
        </form>

        {complianceStatus && (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Result for Application {complianceStatus.id}:</h6>
            <span className={`badge ${complianceStatus.compliant ? 'badge-default' : 'badge-destructive'}`}>
              Status: {complianceStatus.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
            </span>
            <p className={complianceStatus.compliant ? "text-muted-foreground text-sm" : "error-text text-sm"}>
                {complianceStatus.reason}
            </p>
            <p className="text-sm text-muted-foreground italic">
              (Mocked: Imagine updated rules would apply to new checks automatically.)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceValidator;