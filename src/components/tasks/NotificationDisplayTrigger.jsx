import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';

const NotificationDisplayTrigger = ({ task, displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { notifications, addNotification } = useLoan();
  const [notificationType, setNotificationType] = useState('customer'); // 'customer' or 'employee'
  const [triggered, setTriggered] = useState(false);

  // Determine if this task is for applicant or employee notifications
  const isApplicantNotificationTask = task.title.includes('Applicant receives status update');
  const isEmployeeReminderTask = task.title.includes('Employee receives reminder');

  // Guardrail: Authentication is required for any notifications
  if (!isAuthenticated) {
    displayMessage('error', 'You must be logged in to trigger notifications or reminders.');
    return <p className="error-message">Please log in to interact with notifications.</p>;
  }

  const handleTriggerNotification = async () => {
    setTriggered(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate sending delay

    let notifMessage = '';
    let targetUserId = '';
    let notificationCategory = 'info'; // For displayMessage

    if (isApplicantNotificationTask) {
      if (user.role === 'customer') {
        notifMessage = 'Mock: Your application status has been updated to "Under Review".';
        targetUserId = 'CUST001'; // Assuming a mock customer ID for the logged-in customer
        notificationCategory = 'success';
        displayMessage(notificationCategory, notifMessage);
      } else {
        notifMessage = 'Only customers can receive applicant notifications. (Mocked)';
        notificationCategory = 'info';
        displayMessage(notificationCategory, notifMessage);
      }
    } else if (isEmployeeReminderTask) {
      if (user.role === 'officer' || user.role === 'underwriter') {
        // Acceptance Criteria: [Edge] Given reminders are sent when no open tasks exist
        const hasPendingTasks = notifications.some(n => n.userId === 'officer_tasks' && !n.read && n.message.includes('pending'));
        if (!hasPendingTasks) {
          notifMessage = 'No pending tasks found for you. No reminder sent.';
          notificationCategory = 'info';
          displayMessage(notificationCategory, notifMessage);
        } else {
          notifMessage = 'Reminder: You have pending loan applications to review. (Mocked)';
          targetUserId = 'officer_tasks'; // Mock ID for employee task queue
          notificationCategory = 'info';
          displayMessage(notificationCategory, notifMessage);
        }
      } else {
        notifMessage = 'Only loan officers/underwriters receive task reminders. (Mocked)';
        notificationCategory = 'info';
        displayMessage(notificationCategory, notifMessage);
      }
    }

    if (targetUserId && notifMessage && notificationCategory !== 'info') { // Only add if it's a "real" notif
      addNotification({
        id: `NOTIF-${Date.now()}`,
        userId: targetUserId,
        type: isApplicantNotificationTask ? 'status_update' : 'reminder',
        message: notifMessage,
        read: false,
        timestamp: new Date().toISOString(),
      });
    }

    setTriggered(false);

    // Acceptance Criteria: [Edge] Given delivery of notification fails
    if (Math.random() < 0.1) { // 10% chance of failure
      displayMessage('error', 'Notification delivery failed. Retrying...');
    }
  };

  const relevantNotifications = notifications.filter(n => {
    if (isApplicantNotificationTask && user.role === 'customer') {
      return n.userId === 'CUST001' && n.type === 'status_update';
    }
    if (isEmployeeReminderTask && (user.role === 'officer' || user.role === 'underwriter')) {
      return n.userId === 'officer_tasks' && n.type === 'reminder';
    }
    return false;
  }).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)); // Most recent first

  return (
    <div className="dashboard-card">
      <h5>{task.title}</h5>
      <p>{task.description}</p>
      <button onClick={handleTriggerNotification} disabled={triggered}>
        {triggered ? 'Sending...' : 'Trigger Notification / Reminder'}
      </button>

      {relevantNotifications.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h6>Recent Notifications:</h6>
          <ul>
            {relevantNotifications.slice(0, 3).map((notif, index) => (
              <li key={index} style={{ opacity: notif.read ? 0.7 : 1 }}>
                [{new Date(notif.timestamp).toLocaleTimeString()}]{' '}
                {notif.message} {notif.read ? '(Read)' : '(New)'}
              </li>
            ))}
            {relevantNotifications.length > 3 && <li>...</li>}
          </ul>
        </div>
      )}
      {!relevantNotifications.length && (
          <p className="info-message" style={{marginTop: '1.5rem'}}>
              No recent {isApplicantNotificationTask ? 'applicant status updates' : 'employee reminders'} to display.
          </p>
      )}
    </div>
  );
};

export default NotificationDisplayTrigger;