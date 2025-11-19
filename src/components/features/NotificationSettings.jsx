import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { useNotification } from '../common/Notification';
import { simulateCustomerNotification, simulateEmployeeReminder } from '../../utils/api';
import '../../styles/NotificationSettings.css';

function NotificationSettings() {
  const [customerEmail, setCustomerEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isSendingCustomer, setIsSendingCustomer] = useState(false);
  const [isSendingEmployee, setIsSendingEmployee] = useState(false);
  const { showNotification } = useNotification();

  const handleSendCustomerUpdate = async () => {
    if (!customerEmail.trim()) {
      showNotification('Customer email is required.', 'error');
      return;
    }
    setIsSendingCustomer(true);
    try {
      const result = await simulateCustomerNotification(customerEmail);
      if (result.success) {
        showNotification(`Customer notification sent to ${customerEmail}: ${result.message}`, 'success');
      } else {
        showNotification(`Failed to send customer notification to ${customerEmail}: ${result.message}`, 'error');
      }
    } catch (error) {
      showNotification(`Error sending customer notification: ${error.message}`, 'error');
    } finally {
      setIsSendingCustomer(false);
    }
  };

  const handleSendEmployeeReminder = async () => {
    if (!employeeId.trim()) {
      showNotification('Employee ID is required.', 'error');
      return;
    }
    setIsSendingEmployee(true);
    try {
      const result = await simulateEmployeeReminder(employeeId);
      if (result.success) {
        showNotification(`Employee reminder sent to ${employeeId}: ${result.message}`, 'success');
      } else {
        showNotification(`Failed to send employee reminder to ${employeeId}: ${result.message}`, 'error');
      }
    } catch (error) {
      showNotification(`Error sending employee reminder: ${error.message}`, 'error');
    } finally {
      setIsSendingEmployee(false);
    }
  };

  return (
    <div className="notification-settings-container">
      <Card title="Customer Application Status Updates">
        <p>As an applicant, I want to receive email/SMS updates for my loan application status so that I'm informed throughout the process.</p>
        <div className="notification-section">
          <Input
            label="Customer Email/Phone"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="e.g., customer@example.com or +1234567890"
          />
          <Button onClick={handleSendCustomerUpdate} disabled={isSendingCustomer}>
            {isSendingCustomer ? 'Sending...' : 'Simulate Status Update'}
          </Button>
          <p className="notification-hint">
            Simulates sending a notification. For 'delivery fails' scenario, mock API would return an error.
          </p>
        </div>
      </Card>

      <Card title="Internal Task Reminders">
        <p>As a loan officer, I want automated reminders about pending reviews so that I complete them within the SLA.</p>
        <div className="notification-section">
          <Input
            label="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="e.g., LO001"
          />
          <Button onClick={handleSendEmployeeReminder} disabled={isSendingEmployee}>
            {isSendingEmployee ? 'Sending Reminder...' : 'Simulate Employee Reminder'}
          </Button>
          <p className="notification-hint">
            Simulates sending a reminder to an employee for pending tasks. If no tasks, no notification is sent (mock logic).
          </p>
        </div>
      </Card>
    </div>
  );
}

export default NotificationSettings;