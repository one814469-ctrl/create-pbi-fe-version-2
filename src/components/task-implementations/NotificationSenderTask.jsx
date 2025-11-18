import React, { useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { mockNotificationService } from '../../lib/api/mockApi';

const NotificationSenderTask = ({ task }) => {
  const showToast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [notificationContent, setNotificationContent] = useState({
    type: '',
    subject: '',
    body: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const simulateNotification = async (status) => {
    let type = 'Email & SMS';
    let subject = '';
    let body = '';
    const recipient = 'customer@example.com / +1234567890'; // Mock recipient

    switch (status) {
      case 'Submitted':
        subject = 'FinTrust Bank: Loan Application Received';
        body = 'Dear Customer, your loan application has been successfully submitted. We will begin processing it shortly. You can track its status in the portal.';
        break;
      case 'Under Review':
        subject = 'FinTrust Bank: Your Loan Application is Under Review';
        body = 'Dear Customer, your loan application is now being reviewed by our team. We will notify you of any updates.';
        break;
      case 'Approved':
        subject = 'FinTrust Bank: Congratulations! Your Loan is Approved!';
        body = 'Dear Customer, we are pleased to inform you that your loan application has been approved. Funds will be disbursed to your account within 24 hours.';
        break;
      case 'Rejected':
        subject = 'FinTrust Bank: Update on Your Loan Application';
        body = 'Dear Customer, after careful review, we regret to inform you that your loan application has been rejected at this time. Please contact us for more details.';
        break;
      case 'Documents Uploaded':
        subject = 'FinTrust Bank: Documents Received';
        body = 'Dear Customer, your documents have been successfully uploaded and are undergoing verification.';
        break;
      default:
        subject = 'FinTrust Bank: Application Status Update';
        body = `Dear Customer, your application status has changed to: ${status}. Please check the portal for details.`;
    }

    setNotificationContent({ type, subject, body });
    setShowModal(true); // Show modal first

    setIsLoading(true);
    try {
      await mockNotificationService(recipient, subject, body, 'email');
      await mockNotificationService(recipient, subject, body, 'sms');
      showToast('Notifications simulated successfully!', 'success');
    } catch (error) {
      showToast(`Failed to send notifications: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h5>{task.title}</h5>
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-small)', marginBottom: 'var(--spacing-s)' }}>
        Trigger mock email and SMS notifications for various loan application status changes.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-s)', marginTop: 'var(--spacing-m)' }}>
        <Button onClick={() => simulateNotification('Submitted')} disabled={isLoading} variant="primary">
          Simulate: Submitted
        </Button>
        <Button onClick={() => simulateNotification('Documents Uploaded')} disabled={isLoading} variant="secondary">
          Simulate: Docs Uploaded
        </Button>
        <Button onClick={() => simulateNotification('Under Review')} disabled={isLoading} variant="accent">
          Simulate: Under Review
        </Button>
        <Button onClick={() => simulateNotification('Approved')} disabled={isLoading} variant="success">
          Simulate: Approved
        </Button>
        <Button onClick={() => simulateNotification('Rejected')} disabled={isLoading} variant="danger">
          Simulate: Rejected
        </Button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={`Mock Notification Preview (${notificationContent.type})`}
        footer={<Button onClick={closeModal} variant="secondary">Close Preview</Button>}
      >
        <p><strong>To:</strong> Customer Email/Phone (mock)</p>
        <p><strong>Subject:</strong> {notificationContent.subject}</p>
        <p style={{ whiteSpace: 'pre-wrap', border: '1px solid #eee', padding: 'var(--spacing-s)', borderRadius: 'var(--border-radius-sm)', backgroundColor: '#fcfcfc', marginTop: 'var(--spacing-s)' }}>
          {notificationContent.body}
        </p>
        <p style={{marginTop: 'var(--spacing-m)', fontSize: 'var(--font-size-small)', color: 'var(--color-muted)'}}>
            <em>(Mock: SMS and email templates are customizable.)</em>
        </p>
      </Modal>
    </div>
  );
};

export default NotificationSenderTask;