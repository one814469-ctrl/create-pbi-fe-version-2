import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';

const CreditCheckInitiator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { updateApplication } = useLoan();
  const [applicationId, setApplicationId] = useState('');
  const [creditCheckResult, setCreditCheckResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter')) {
    displayMessage('error', 'Access denied. You need loan officer/underwriter permissions to initiate credit checks.');
    return (
      <p className="error-message">
        Access Denied: Only loan officers and underwriters can initiate credit checks.
      </p>
    );
  }

  const handleInitiateCreditCheck = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      displayMessage('error', 'Please enter an Application ID.');
      return;
    }

    setLoading(true);
    setCreditCheckResult(null);

    // Simulate API call to Credit Bureau
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Acceptance Criteria: [Negative] Given invalid applicant data
    if (applicationId === 'INVALID') {
      setCreditCheckResult({ error: 'Validation Error: Invalid applicant data provided.' });
      displayMessage('error', 'Credit check failed: Invalid data.');
      setLoading(false);
      return;
    }

    // Acceptance Criteria: [Edge] Given the API times out or is unavailable
    if (applicationId === 'TIMEOUT') {
      setCreditCheckResult({ error: 'API Timeout: Credit Bureau service unavailable.' });
      displayMessage('error', 'Credit check failed: API timeout. Manual review initiated.');
      setLoading(false);
      // Simulate flagging for manual review
      updateApplication(applicationId, { creditCheckStatus: 'Manual Review Required' });
      return;
    }

    // Acceptance Criteria: Given all required applicant data is present
    // When I submit an application for credit review, Then the credit bureau API returns a score and report
    const mockScore = Math.floor(Math.random() * (850 - 300 + 1)) + 300; // FICO range
    const mockReport = mockScore > 700 ? 'Excellent credit history.' : (mockScore > 600 ? 'Good credit history.' : 'Fair to poor credit history.');

    setCreditCheckResult({ score: mockScore, report: mockReport });
    displayMessage('success', `Credit check completed for ${applicationId}. Score: ${mockScore}`);
    updateApplication(applicationId, {
      creditScore: mockScore,
      creditReport: mockReport,
      creditCheckStatus: 'Completed',
      auditTrail: [
        ...(applications.find(app => app.id === applicationId)?.auditTrail || []),
        { timestamp: new Date().toISOString(), user: user.username, action: `Credit Check Initiated. Score: ${mockScore}` }
      ]
    });
    setLoading(false);
  };

  return (
    <div className="dashboard-card">
      <h5>Initiate Automated Credit Check</h5>
      <form onSubmit={handleInitiateCreditCheck}>
        <div className="form-group">
          <label htmlFor="creditAppId">Application ID:</label>
          <input
            type="text"
            id="creditAppId"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="e.g., LA001, LA002, INVALID, TIMEOUT"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Initiate Credit Check'}
          </button>
        </div>
      </form>

      {creditCheckResult && (
        <div style={{ marginTop: '1.5rem' }}>
          <h6>Credit Check Result:</h6>
          {creditCheckResult.error ? (
            <p className="error-message">Error: {creditCheckResult.error}</p>
          ) : (
            <>
              <p>Credit Score: <strong>{creditCheckResult.score}</strong></p>
              <p>Report Summary: {creditCheckResult.report}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CreditCheckInitiator;