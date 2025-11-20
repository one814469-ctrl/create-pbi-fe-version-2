import React, { useState, useEffect } from 'react';
import { useApplications } from '../../context/ApplicationContext';

const OCRProcessor = ({ appId, ocrStatus }) => {
  const { simulateOCRProcessing, getApplicationById } = useApplications();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const application = getApplicationById(appId);

  useEffect(() => {
    if (ocrStatus === 'completed') {
      setMessage('OCR processing completed successfully. Data extracted.');
      setMessageType('success');
    } else if (ocrStatus === 'failed') {
      setMessage('OCR processing failed. Application flagged for manual review.');
      setMessageType('error');
    } else if (ocrStatus === 'pending') {
      setMessage('OCR processing is pending for documents.');
      setMessageType('info');
    }
  }, [ocrStatus]);

  const handleRunOCR = () => {
    setMessage('Initiating OCR processing...');
    setMessageType('info');
    simulateOCRProcessing(appId);
  };

  return (
    <div className="card">
      <h4>Automatic OCR Processing</h4>
      {message && <div className={`message-${messageType}`}>{message}</div>}
      <p>Current OCR Status: <span className={`status-badge ${ocrStatus}`}>{ocrStatus.replace('-', ' ')}</span></p>
      <div className="form-actions" style={{justifyContent: 'flex-start'}}>
        <button onClick={handleRunOCR} disabled={ocrStatus === 'completed'}>Run OCR Processing</button>
      </div>
      {application?.documents && application.documents.length > 0 && (
        <div className="detail-section">
          <h5>Document OCR Status</h5>
          <ul className="document-list">
            {application.documents.map((doc, index) => (
              <li key={index}>
                <span>{doc.name}</span>
                <span className={`status-badge ${doc.extractedData?.ocr ? 'completed' : 'pending'}`}>
                  {doc.extractedData?.ocr ? 'Extracted' : 'Pending OCR'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OCRProcessor;