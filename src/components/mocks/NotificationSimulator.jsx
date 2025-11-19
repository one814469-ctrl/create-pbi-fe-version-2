import React, { useState } from 'react';
import Button from '../ui/Button';

const NotificationSimulator = ({ notificationType, onUpdateApplication }) => {
  const [lastNotification, setLastNotification] = useState(null);
  const [status, setStatus] = useState('');

  const sendNotification = (type) => {
    setStatus('Sending...');
    // Simulate API call or external service for notifications
    setTimeout(() => {
      let message = '';
      let resultType = 'info';
      switch (type) {
        case 'document_verification':
          const docVerified = Math.random() > 0.3; // 70% chance of success
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
          const hasPending = Math.random() > 0.2; // 80% chance of pending tasks
          message = hasPending
            ? 'Reminder: You have 3 pending loan applications requiring review. Please action within SLA.'
            : 'No pending tasks currently require your attention.';
          resultType = hasPending ? 'info' : 'success';
          // Simulate edge case: no notification sent if no tasks
          if (!hasPending) message = 'No pending tasks, no reminder sent.';
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
      setTimeout(() => setStatus(''), 3000); // Clear status after a few seconds
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

  const getAcceptanceCriteria = () => {
    switch (notificationType) {
      case 'document_verification': return "Given my documents have been processed, When verification is completed, Then I receive a notification with pass/fail result and next steps (Mocked)";
      case 'application_status': return "Given my application status changes, When the change is processed, Then I receive an email/SMS notification with updated status (Mocked)";
      case 'internal_reminder': return "Given I have pending applications assigned, When a reminder is due, Then I receive an email/SMS notification of pending tasks (Mocked)";
      default: return "";
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
          {notificationType === 'document_verification' && lastNotification.type === 'error' && (
            <p className="error-message">
              <em>Edge Case: "Given document verification fails, When I view my application, Then I see specific reasons and a prompt to re-upload or correct information" (Mocked)</em>
            </p>
          )}
          {notificationType === 'internal_reminder' && lastNotification.message.includes('No pending tasks') && (
            <p className="info-message">
              <em>Edge Case: "Given reminders are sent when no open tasks exist, When the reminder is triggered, Then no notification is sent" (Mocked)</em>
            </p>
          )}
        </div>
      )}
      <p className="mt-4"><em>Acceptance Criteria: {getAcceptanceCriteria()}</em></p>
    </div>
  );
};

export default NotificationSimulator;