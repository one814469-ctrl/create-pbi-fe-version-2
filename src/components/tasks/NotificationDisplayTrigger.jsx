import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast'; // Directly use useToast

const NotificationDisplayTrigger = ({ task, displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, notifications, addNotification } = useLoan();
  const [triggered, setTriggered] = useState(false);
  const { toast } = useToast();

  const isApplicantNotificationTask = task.title.includes('Applicant receives status update');
  const isEmployeeReminderTask = task.title.includes('Employee receives reminder');

  // Guardrail: Authentication is required for any notifications
  if (!isAuthenticated) {
    displayMessage('error', 'Authentication Required', 'You must be logged in to trigger notifications or reminders.');
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>{task.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Please log in to interact with notifications.</p>
        </CardContent>
      </Card>
    );
  }

  const handleTriggerNotification = async () => {
    setTriggered(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate sending delay

    let notifMessage = '';
    let targetUserId = '';
    let toastVariant = 'default';

    if (isApplicantNotificationTask) {
      if (user.role === 'customer') {
        const customerApp = applications.find(app => app.customerID === user.customerID);
        if (customerApp) {
          notifMessage = `Your application ID ${customerApp.id} status has been updated to "Under Review".`;
          targetUserId = user.customerID;
          toastVariant = 'default'; // Success for the customer
          displayMessage('success', 'Status Update', notifMessage);
        } else {
          notifMessage = 'No active application found for your customer account to update.';
          toastVariant = 'foreground';
          displayMessage('info', 'Status Update', notifMessage);
        }
      } else {
        notifMessage = 'This notification type is for customers. (Mocked)';
        toastVariant = 'foreground';
        displayMessage('info', 'Information', notifMessage);
      }
    } else if (isEmployeeReminderTask) {
      if (user.role === 'officer' || user.role === 'underwriter') {
        const hasPendingTasks = notifications.some(n => n.userId === 'officer_tasks' && !n.read && n.message.includes('pending'));
        if (!hasPendingTasks) {
          notifMessage = 'No pending tasks found for you. No reminder sent.';
          toastVariant = 'foreground';
          displayMessage('info', 'Reminder Info', notifMessage);
        } else {
          notifMessage = 'Reminder: You have pending loan applications to review. (Mocked)';
          targetUserId = 'officer_tasks'; // Mock ID for employee task queue
          toastVariant = 'default';
          displayMessage('info', 'Task Reminder', notifMessage);
        }
      } else {
        notifMessage = 'This reminder type is for loan officers/underwriters. (Mocked)';
        toastVariant = 'foreground';
        displayMessage('info', 'Information', notifMessage);
      }
    }

    // [Edge] Given delivery of notification fails
    if (Math.random() < 0.1) { // 10% chance of failure
      displayMessage('destructive', 'Delivery Failed', 'Notification delivery failed. Retrying...');
      // In a real system, a retry mechanism would be triggered and logged
    } else if (targetUserId && notifMessage && toastVariant !== 'foreground') { // Only add if it's a "real" notif and not just an info message
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleTriggerNotification} disabled={triggered}>
          {triggered ? 'Sending...' : 'Trigger Notification / Reminder'}
        </Button>

        {relevantNotifications.length > 0 ? (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Recent Notifications:</h6>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {relevantNotifications.slice(0, 3).map((notif, index) => (
                <li key={index} className={notif.read ? 'opacity-70' : 'font-medium'}>
                  [{new Date(notif.timestamp).toLocaleTimeString()}] {notif.message} {notif.read ? '(Read)' : '(New)'}
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
      </CardContent>
    </Card>
  );
};

export default NotificationDisplayTrigger;