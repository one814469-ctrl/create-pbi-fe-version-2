import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';

const CreditCheckInitiator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplication } = useLoan();
  const [applicationId, setApplicationId] = useState('');
  const [creditCheckResult, setCreditCheckResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter')) {
    displayMessage('error', 'Access Denied', 'You need loan officer/underwriter permissions to initiate credit checks.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Initiate Automated Credit Check</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only loan officers and underwriters can initiate credit checks.</p>
        </div>
      </div>
    );
  }

  const handleInitiateCreditCheck = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      displayMessage('error', 'Validation Error', 'Please enter an Application ID.');
      return;
    }

    setLoading(true);
    setCreditCheckResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (applicationId === 'INVALID') {
      setCreditCheckResult({ error: 'Validation Error: Invalid applicant data provided.' });
      displayMessage('error', 'Credit Check Failed', 'Invalid data provided for credit check.');
      setLoading(false);
      return;
    }

    if (applicationId === 'TIMEOUT') {
      setCreditCheckResult({ error: 'API Timeout: Credit Bureau service unavailable.' });
      displayMessage('error', 'Credit Check Failed', 'Credit Bureau API timed out. Manual review workflow initiated.');
      setLoading(false);
      updateApplication(applicationId, { creditCheckStatus: 'Manual Review Required (Credit)', status: 'Manual Review Required (Credit)' });
      return;
    }

    const mockScore = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
    const mockReport = mockScore > 700 ? 'Excellent credit history.' : (mockScore > 600 ? 'Good credit history.' : 'Fair to poor credit history.');

    setCreditCheckResult({ score: mockScore, report: mockReport });
    displayMessage('success', 'Credit Check Completed', `Credit check completed for ${applicationId}. Score: ${mockScore}`);
    
    const currentApp = applications.find(app => app.id === applicationId);
    updateApplication(applicationId, {
      creditScore: mockScore,
      creditReport: mockReport,
      creditCheckStatus: 'Completed',
      status: `Credit Score: ${mockScore}`,
      auditTrail: [
        ...(currentApp?.auditTrail || []),
        { timestamp: new Date().toISOString(), user: user.username, action: `Credit Check Initiated. Score: ${mockScore}` }
      ]
    });
    setLoading(false);
  };

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">Initiate Automated Credit Check</h3>
        <p className="card-description">Initiate a credit check for applications to assess loan eligibility quickly.</p>
      </div>
      <div className="card-content space-y-6">
        <form onSubmit={handleInitiateCreditCheck} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="creditAppId" className="block text-sm font-medium">Application ID</label>
            <input
              id="creditAppId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g., LA001, LA002, INVALID, TIMEOUT"
              disabled={loading}
              className="w-full"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Initiate Credit Check'}
          </button>
        </form>

        {creditCheckResult && (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Credit Check Result:</h6>
            {creditCheckResult.error ? (
              <p className="error-text">Error: {creditCheckResult.error}</p>
            ) : (
              <>
                <p>Credit Score: <strong className={creditCheckResult.score < 600 ? "text-destructive text-xl" : "text-primary text-xl"}>{creditCheckResult.score}</strong></p>
                <p className="text-muted-foreground">Report Summary: {creditCheckResult.report}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditCheckInitiator;