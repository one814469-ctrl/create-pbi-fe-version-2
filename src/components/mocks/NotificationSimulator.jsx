import React, { useState } from 'react';
import Button from '../ui/Button';

const NotificationSimulator = ({ notificationType, onUpdateApplication, task }) => {
  const [lastNotification, setLastNotification] = useState(null);
  const [status, setStatus] = useState('');

  const sendNotification = (type) => {
    setStatus('Sending...');
    setTimeout(() => {
      let message = '';
      let resultType = 'info';
      let notificationDelivered = Math.random() > 0.1;

      if (!notificationDelivered && type !== 'internal_reminder') {
        message = `Notification delivery failed for ${type}. A retry mechanism would be triggered.`;
        resultType = 'error';
        setLastNotification({ message, type: resultType });
        setStatus('Failed!');
        onUpdateApplication && onUpdateApplication(prev => ({
          ...prev,
          history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: `Notification Delivery Failed for ${type}` }]
        }));
        setTimeout(() => setStatus(''), 3000);
        return;
      }

      switch (type) {
        case 'document_verification':
          const docVerified = Math.random() > 0.3;
          message = docVerified
            ? 'Your documents have been successfully verified! Application is proceeding.'
            : 'Document verification failed. Please review and re-upload required identity documents.';
          resultType = docVerified ? 'success' : 'error';
          onUpdateApplication && onUpdateApplication(prev => ({
            ...prev,
            docVerificationStatus: docVerified ? 'Verified' : 'Failed',
            history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: `Document Verification Notification Sent: ${resultType}` }]
          }));
          break;
        case 'application_status':
          const statuses = ['Pending Review', 'Documents Received', 'Credit Check Complete', 'Approved', 'Rejected'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          message = `Your loan application status has been updated to: "${randomStatus}". Check portal for details.`;
          resultType = 'info';
          onUpdateApplication && onUpdateApplication(prev => ({
            ...prev,
            status: randomStatus,
            history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: `Application Status Notification Sent: ${randomStatus}` }]
          }));
          break;
        case 'internal_reminder':
          const hasPending = Math.random() > 0.2;
          if (hasPending) {
            message = 'Reminder: You have 3 pending loan applications requiring review. Please action within SLA.';
            resultType = 'info';
          } else {
            message = 'No pending tasks currently require your attention. No reminder sent.';
            resultType = 'success';
          }
          onUpdateApplication && onUpdateApplication(prev => ({
            ...prev,
            internalReminders: [...(prev.internalReminders || []), { timestamp: new Date().toISOString(), message: message }]
          }));
          break;
        default:
          message = 'Unknown notification type.';
          resultType = 'error';
      }
      setLastNotification({ message, type: resultType });
      setStatus('Sent!');
      setTimeout(() => setStatus(''), 3000);
    }, 1500);
  };

  const getButtonText = () => {
    switch (notificationType) {
      case 'document_verification': return 'Simulate Doc Verification Notification';
      case 'application_status': return 'Simulate Status Update Notification';
      case 'internal_reminder': return 'Simulate Employee Task Reminder';
      default: return 'Simulate Notification';
    }
  };

  return (
    <div className="notification-simulator">
      <h4>{getButtonText().replace('Simulate ', '')}</h4>
      <Button onClick={() => sendNotification(notificationType)} disabled={status === 'Sending...'} className="button-secondary">
        {status || getButtonText()}
      </Button>
      {lastNotification && (
        <div className={`mock-api-response mt-4 ${lastNotification.type}`}>
          <h5>Last Mock Notification:</h5>
          <p>{lastNotification.message}</p>
          {notificationType === 'document_verification' && lastNotification.type === 'error' && task && task.acceptance_criteria[1] && (
            <p className="error-message mt-2">
              <em>Acceptance Criteria (Edge): {task.acceptance_criteria[1]} (Mocked: Specific reasons shown for failure)</em>
            </p>
          )}
          {notificationType === 'application_status' && lastNotification.type === 'error' && task && task.acceptance_criteria[1] && (
            <p className="error-message mt-2">
              <em>Acceptance Criteria (Edge): {task.acceptance_criteria[1]} (Mocked: Retry mechanism triggered and failure logged)</em>
            </p>
          )}
          {notificationType === 'internal_reminder' && lastNotification.message.includes('No pending tasks') && task && task.acceptance_criteria[1] && (
            <p className="info-message mt-2">
              <em>Acceptance Criteria (Edge): {task.acceptance_criteria[1]} (Mocked: No notification sent when no open tasks exist)</em>
            </p>
          )}
          {lastNotification.type !== 'error' && task && task.acceptance_criteria[0] && (
            <p className="mt-2 success-message">
              <em>Acceptance Criteria (Positive): {task.acceptance_criteria[0]} (Mocked: Notification received with updated status/result)</em>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSimulator;