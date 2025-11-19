import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { useNotification } from '../common/Notification';
import { initiateCreditCheck } from '../../utils/api';
import '../../styles/CreditCheck.css';

function CreditCheckSimulator() {
  const [applicantId, setApplicantId] = useState('');
  const [creditReport, setCreditReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();

  const handleInitiateCreditCheck = async () => {
    setError('');
    setCreditReport(null);

    if (!applicantId.trim()) {
      setError('Applicant ID is required.');
      showNotification('Applicant ID is required to initiate credit check.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await initiateCreditCheck(applicantId);
      setCreditReport(result);
      showNotification('Credit check completed successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(`Credit check failed: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Initiate Automated Credit Check">
      <p>As a system, I want to initiate a credit check for applications so that loan eligibility can be assessed quickly.</p>
      <div className="credit-check-container">
        <Input
          label="Applicant ID"
          value={applicantId}
          onChange={(e) => setApplicantId(e.target.value)}
          placeholder="Enter applicant ID"
          error={error}
        />
        <Button onClick={handleInitiateCreditCheck} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Initiate Credit Check'}
        </Button>

        {creditReport && (
          <div className="credit-report-display card">
            <h4>Credit Report for Applicant ID: {applicantId}</h4>
            <p><strong>Credit Score:</strong> <span className={`score-${creditReport.score >= 650 ? 'good' : 'bad'}`}>{creditReport.score}</span></p>
            <p><strong>Report Summary:</strong> {creditReport.summary}</p>
            {creditReport.flags.length > 0 && (
              <div className="credit-flags">
                <h5>Flags:</h5>
                <ul>
                  {creditReport.flags.map((flag, index) => (
                    <li key={index} className="warning-message">{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default CreditCheckSimulator;