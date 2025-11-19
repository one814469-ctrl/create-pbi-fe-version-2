import React, { useState } from 'react';
import Button from '../ui/Button';

const CreditCheckMock = ({ onUpdateApplication }) => {
  const [creditResult, setCreditResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initiateCreditCheck = () => {
    setIsLoading(true);
    // Simulate API call to Credit Bureau
    setTimeout(() => {
      const isApiAvailable = Math.random() > 0.1; // 90% chance API is available
      if (isApiAvailable) {
        const score = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
        const report = `Credit score: ${score}, Delinquencies: ${Math.floor(Math.random() * 3)}, Inquiries: ${Math.floor(Math.random() * 5)}.`;
        setCreditResult({ score, report, status: 'success' });
        onUpdateApplication && onUpdateApplication(prev => ({
          ...prev,
          creditScore: score,
          history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: 'Credit Check Initiated' }]
        }));
      } else {
        setCreditResult({ status: 'error', message: 'Credit Bureau API timed out or is unavailable.' });
        onUpdateApplication && onUpdateApplication(prev => ({
          ...prev,
          creditScore: 'N/A',
          history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: 'Credit Check Failed (API Timeout)' }]
        }));
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="credit-check-mock">
      <h4>Initiate Automated Credit Check</h4>
      <p>Simulates calling the Credit Bureau API to get applicant credit score and report.</p>
      <Button onClick={initiateCreditCheck} disabled={isLoading} className="button-secondary">
        {isLoading ? 'Checking Credit...' : 'Initiate Credit Check'}
      </Button>
      {creditResult && (
        <div className="mock-api-response mt-4">
          <h5>Credit Check Result:</h5>
          {creditResult.status === 'success' ? (
            <>
              <p><strong>Score:</strong> {creditResult.score}</p>
              <p><strong>Report Summary:</strong> {creditResult.report}</p>
              <p className="success-message"><em>Acceptance Criteria: "Given all required applicant data is present, When I submit an application for credit review, Then the credit bureau API returns a score and report" (Mocked)</em></p>
            </>
          ) : (
            <>
              <p className="error-message">{creditResult.message}</p>
              <p className="error-message"><em>Edge Case: "Given the API times out or is unavailable, When a credit check is requested, Then a manual review workflow is initiated and flagged for loan officer" (Mocked)</em></p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CreditCheckMock;