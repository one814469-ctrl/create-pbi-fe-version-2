import React, { useState, useEffect } from 'react';
import { useApplications } from '../../context/ApplicationContext';

const CreditCheckWidget = ({ appId, creditScore, creditReport }) => {
  const { simulateCreditCheck, getApplicationById } = useApplications();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const application = getApplicationById(appId);

  useEffect(() => {
    if (creditScore) {
      setMessage('Credit check completed successfully.');
      setMessageType('success');
    } else if (application?.auditTrail.some(entry => entry.action.includes('Credit Bureau API unavailable'))) {
      setMessage('Credit Bureau API was unavailable. Manual review prompted.');
      setMessageType('warning');
    } else {
      setMessage('');
      setMessageType('');
    }
  }, [creditScore, application?.auditTrail]);

  const handleCreditCheck = () => {
    setMessage('Initiating automated credit check...');
    setMessageType('info');
    simulateCreditCheck(appId);
  };

  return (
    <div className="card">
      <h4>Automated Credit Check</h4>
      {message && <div className={`message-${messageType}`}>{message}</div>}
      <div className="detail-item"><strong>Credit Score:</strong> {creditScore || 'N/A'}</div>
      <div className="detail-item"><strong>Credit Report:</strong> {creditReport || 'Not available'}</div>
      <div className="form-actions" style={{justifyContent: 'flex-start'}}>
        <button onClick={handleCreditCheck} disabled={!!creditScore}>Run Credit Check</button>
      </div>
    </div>
  );
};

export default CreditCheckWidget;