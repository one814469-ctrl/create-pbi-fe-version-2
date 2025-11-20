import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';

const NotificationDisplayTrigger = ({ task, displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, notifications, addNotification } = useLoan();
  const [triggered, setTriggered] = useState(false);

  const isApplicantNotificationTask = task.title.includes('Applicant receives status update');
  const isEmployeeReminderTask = task.title.includes('Employee receives reminder');

  if (!isAuthenticated) {
    displayMessage('error', 'Authentication Required', 'You must be logged in to trigger notifications or reminders.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">{task.title}</p>
        </div>
        <div className="card-content">
          <p className="error-text">Please log in to interact with notifications.</p>
        </div>
      </div>
    );
  }

  const handleTriggerNotification = async () => {
    setTriggered(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    let notifMessage = '';
    let targetUserId = '';
    let toastType = 'info';

    if (isApplicantNotificationTask) {
      if (user.role === 'customer') {
        const customerApp = applications.find(app => app.customerID === user.customerID);
        if (customerApp) {
          notifMessage = `Your application ID ${customerApp.id} status has been updated to "Under Review".`;
          targetUserId = user.customerID;
          toastType = 'success';
          displayMessage('success', 'Status Update', notifMessage);
        } else {
          notifMessage = 'No active application found for your customer account to update.';
          toastType = 'info';
          displayMessage('info', 'Status Update', notifMessage);
        }
      } else {
        notifMessage = 'This notification type is for customers. (Mocked)';
        toastType = 'info';
        displayMessage('info', 'Information', notifMessage);
      }
    } else if (isEmployeeReminderTask) {
      if (user.role === 'officer' || user.role === 'underwriter') {
        const hasPendingTasks = applications.some(app => app.status.includes('Pending') || app.status.includes('Required') || app.status.includes('Manual'));
        if (!hasPendingTasks) {
          notifMessage = 'No pending tasks found for you. No reminder sent.';
          toastType = 'info';
          displayMessage('info', 'Reminder Info', notifMessage);
        } else {
          notifMessage = 'Reminder: You have pending loan applications to review. (Mocked)';
          targetUserId = 'officer_tasks';
          toastType = 'info';
          displayMessage('info', 'Task Reminder', notifMessage);
        }
      } else {
        notifMessage = 'This reminder type is for loan officers/underwriters. (Mocked)';
        toastType = 'info';
        displayMessage('info', 'Information', notifMessage);
      }
    }

    if (Math.random() < 0.1) {
      displayMessage('error', 'Delivery Failed', 'Notification delivery failed. Retrying...');
    } else if (targetUserId && notifMessage && toastType !== 'info') {
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
  };

  const relevantNotifications = notifications.filter(n => {
    if (isApplicantNotificationTask && user.role === 'customer') {
      return n.userId === user.customerID && n.type === 'status_update';
    }
    if (isEmployeeReminderTask && (user.role === 'officer' || user.role === 'underwriter')) {
      return n.userId === 'officer_tasks' && n.type === 'reminder';
    }
    return false;
  }).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">{task.title}</h3>
        <p className="card-description">{task.description}</p>
      </div>
      <div className="card-content space-y-4">
        <button onClick={handleTriggerNotification} disabled={triggered}>
          {triggered ? 'Sending...' : 'Trigger Notification / Reminder'}
        </button>

        {relevantNotifications.length > 0 ? (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Recent Notifications:</h6>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {relevantNotifications.slice(0, 3).map((notif, index) => (
                <li key={index} className={notif.read ? 'opacity-70' : 'font-medium'}>
                  <span className={`badge ${notif.read ? 'badge-secondary' : 'badge-default'} mr-2`}>
                    {notif.read ? 'Read' : 'New'}
                  </span>
                  [{new Date(notif.timestamp).toLocaleTimeString()}] {notif.message}
                </li>
              ))}
              {relevantNotifications.length > 3 && <li>...</li>}
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            No recent {isApplicantNotificationTask ? 'applicant status updates' : 'employee reminders'} to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationDisplayTrigger;