import React, { useState } from 'react';
import Button from '../ui/Button';

const CreditCheckMock = ({ onUpdateApplication, task }) => {
  const [creditResult, setCreditResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initiateCreditCheck = () => {
    setIsLoading(true);
    // Simulate API call to Credit Bureau
    setTimeout(() => {
      const isApiAvailable = Math.random() > 0.1; // 90% chance API is available
      const isValidData = Math.random() > 0.05; // 95% chance of valid data

      if (!isValidData) {
        setCreditResult({ status: 'error', message: 'Invalid applicant data. Credit check not processed.' });
        onUpdateApplication && onUpdateApplication(prev => ({
          ...prev,
          creditScore: 'N/A',
          history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: 'Credit Check Failed (Invalid Data)' }]
        }));
        setIsLoading(false);
        return;
      }

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
        setCreditResult({ status: 'error', message: 'Credit Bureau API timed out or is unavailable. Manual review flagged.' });
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
        <div className={`mock-api-response mt-4 ${creditResult.status}`}>
          <h5>Credit Check Result:</h5>
          {creditResult.status === 'success' ? (
            <>
              <p><strong>Score:</strong> {creditResult.score}</p>
              <p><strong>Report Summary:</strong> {creditResult.report}</p>
              <p className="success-message mt-2">
                <em>Acceptance Criteria (Positive): {task.acceptance_criteria[0]} (Mocked: API returns score and report)</em>
              </p>
            </>
          ) : (
            <>
              <p>{creditResult.message}</p>
              {creditResult.message.includes('timed out or is unavailable') && (
                <p className="error-message mt-2">
                  <em>Acceptance Criteria (Edge): {task.acceptance_criteria[1]} (Mocked: Manual review initiated)</em>
                </p>
              )}
              {creditResult.message.includes('Invalid applicant data') && (
                <p className="error-message mt-2">
                  <em>Acceptance Criteria (Negative): {task.acceptance_criteria[2]} (Mocked: Validation error)</em>
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CreditCheckMock;