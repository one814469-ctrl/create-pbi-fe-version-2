import React, { useState } from 'react';

const NotificationTask = ({ task }) => {
  const [showModal, setShowModal] = useState(false);
  const [notificationContent, setNotificationContent] = useState({
    type: '',
    subject: '',
    body: ''
  });

  const simulateNotification = (status) => {
    let type = 'Email & SMS';
    let subject = '';
    let body = '';

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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h5>{task.title}</h5>
      <p>Simulate sending notifications for various application status changes.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
        <button onClick={() => simulateNotification('Submitted')}>
          Simulate: Submitted
        </button>
        <button onClick={() => simulateNotification('Documents Uploaded')}>
          Simulate: Docs Uploaded
        </button>
        <button onClick={() => simulateNotification('Under Review')}>
          Simulate: Under Review
        </button>
        <button onClick={() => simulateNotification('Approved')} style={{ background: '#28a745' }}>
          Simulate: Approved
        </button>
        <button onClick={() => simulateNotification('Rejected')} style={{ background: '#dc3545' }}>
          Simulate: Rejected
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Mock Notification ({notificationContent.type})</h5>
            <p><strong>To:</strong> Customer Email/Phone (mock)</p>
            <p><strong>Subject:</strong> {notificationContent.subject}</p>
            <p><strong>Body:</strong> {notificationContent.body}</p>
            <p style={{marginTop: '15px', fontSize: '0.8em', color: '#aaa'}}>
                <em>(Mock: SMS and email templates are customizable.)</em>
            </p>
            <button onClick={closeModal}>Close Mock</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationTask;