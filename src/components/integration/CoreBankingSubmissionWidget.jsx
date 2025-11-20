import React, { useState, useEffect } from 'react';
import { useApplications } from '../../context/ApplicationContext';

const CoreBankingSubmissionWidget = ({ appId }) => {
  const { submitToCoreSystem, getApplicationById } = useApplications();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const application = getApplicationById(appId);

  useEffect(() => {
    if (application?.status === 'processed-by-core-system') {
      setMessage('Application successfully submitted to Core Banking System.');
      setMessageType('success');
    } else if (application?.auditTrail.some(entry => entry.action.includes('Core Banking System API is down'))) {
      setMessage('Core Banking System API is down. Submission failed.');
      setMessageType('error');
    } else if (application?.auditTrail.some(entry => entry.action.includes('Core Banking System validation failed'))) {
      setMessage('Submission failed: Application failed core system validation.');
      setMessageType('error');
    } else {
      setMessage('');
      setMessageType('');
    }
  }, [application]);

  const handleSubmit = () => {
    setMessage('Attempting to submit to Core Banking System...');
    setMessageType('info');
    submitToCoreSystem(appId);
  };

  return (
    <div className="card">
      <h4>Submit Approved Application to Core System</h4>
      {message && <div className={`message-${messageType}`}>{message}</div>}
      <p>Only approved applications can be submitted to the Core Banking System for disbursement.</p>
      <div className="form-actions" style={{justifyContent: 'flex-start'}}>
        <button onClick={handleSubmit} disabled={application?.status !== 'approved' && application?.status !== 'processed-by-core-system'}>
          {application?.status === 'processed-by-core-system' ? 'Submitted' : 'Submit to Core System'}
        </button>
      </div>
    </div>
  );
};

export default CoreBankingSubmissionWidget;