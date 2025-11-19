import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useNotification } from '../common/Notification';
import { getDocumentVerificationStatus, simulateDocumentVerification } from '../../utils/api';
import '../../styles/VerificationStatus.css';

function DocumentVerificationStatus() {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const fetchVerificationStatus = async () => {
    setIsLoading(true);
    try {
      const status = await getDocumentVerificationStatus();
      setVerificationStatus(status);
      if (status.status === 'verified') {
        showNotification('Your documents have been successfully verified!', 'success');
      } else if (status.status === 'failed') {
        showNotification('Document verification failed. Please review.', 'error');
      } else {
        showNotification('Document verification is pending.', 'info');
      }
    } catch (error) {
      showNotification(`Failed to fetch verification status: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerVerification = async () => {
    setIsLoading(true);
    try {
      const status = await simulateDocumentVerification();
      setVerificationStatus(status);
      if (status.status === 'verified') {
        showNotification('Documents processed and verified successfully!', 'success');
      } else if (status.status === 'failed') {
        showNotification('Document processing failed. Please check details.', 'error');
      }
    } catch (error) {
      showNotification(`Error triggering verification: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  return (
    <Card title="Notify Applicant of Document Verification Status">
      <p>As an applicant, I want to be informed if my documents are verified or need correction so that I can respond promptly.</p>
      <div className="verification-status-container">
        <Button onClick={triggerVerification} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Simulate Document Verification'}
        </Button>

        {verificationStatus && (
          <div className={`verification-results card status-${verificationStatus.status}`}>
            <h4>Verification Result:</h4>
            <p>Status: <span className="status-text">{verificationStatus.status.toUpperCase()}</span></p>
            {verificationStatus.status === 'failed' && (
              <div className="failure-details">
                <p className="error-message">Reason: {verificationStatus.reason}</p>
                <p>Please review your uploaded documents and re-upload if necessary.</p>
                <Button variant="secondary">Re-upload Documents</Button>
              </div>
            )}
            {verificationStatus.status === 'pending' && (
              <p className="info-message">Your documents are currently under review. We will notify you once completed.</p>
            )}
            {verificationStatus.status === 'verified' && (
              <p className="success-message">All required documents have been successfully verified.</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default DocumentVerificationStatus;