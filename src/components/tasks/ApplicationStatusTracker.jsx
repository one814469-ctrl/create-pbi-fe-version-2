import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';
import { useNavigate } from 'react-router-dom';

const ApplicationStatusTracker = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { getCustomerApplications } = useLoan();
  const navigate = useNavigate();

  // Acceptance Criteria: [Negative] Given I access the status page without authentication
  if (!isAuthenticated) {
    displayMessage('error', 'You must be logged in to view application status.');
    return <p className="error-message">Please log in to view your application status.</p>;
  }

  // Find applications for the current user (mock customer ID for demo)
  const customerApplications = getCustomerApplications(user.role === 'customer' ? 'CUST001' : null);

  // Acceptance Criteria: [Edge] Given I have no submitted applications
  if (customerApplications.length === 0) {
    return (
      <div className="dashboard-card">
        <h5>No Loan Applications Found</h5>
        <p>It looks like you haven't submitted any loan applications yet.</p>
        <button onClick={() => navigate('/epics/loan-application-portal')}>Start a New Application</button>
      </div>
    );
  }

  const getStatusSteps = (status) => {
    const steps = [
      { name: 'Application Submitted', key: 'submitted', order: 1 },
      { name: 'Documents Uploaded', key: 'documents', order: 2 },
      { name: 'Document Review', key: 'doc_review', order: 3 },
      { name: 'Credit Check', key: 'credit_check', order: 4 },
      { name: 'Compliance Check', key: 'compliance', order: 5 },
      { name: 'Decision Made', key: 'decision', order: 6 },
    ];

    let currentStepIndex = 0;
    if (status.includes('Submitted')) currentStepIndex = 0;
    if (status.includes('Documents')) currentStepIndex = 1;
    if (status.includes('Document Review')) currentStepIndex = 2;
    if (status.includes('Credit Check')) currentStepIndex = 3;
    if (status.includes('Compliance')) currentStepIndex = 4;
    if (status.includes('Approved') || status.includes('Rejected')) currentStepIndex = 5;

    return steps.map((step, index) => ({
      ...step,
      state: index < currentStepIndex ? 'completed' : (index === currentStepIndex ? 'current' : 'pending'),
      isFailed: status === 'Rejected' && index === 5, // Mark final step as failed if rejected
    }));
  };

  // Acceptance Criteria: Given I am logged in and have an active loan application
  return (
    <div>
      {customerApplications.map((app) => (
        <div key={app.id} className="dashboard-card" style={{ marginBottom: '2rem' }}>
          <h5>Application ID: {app.id} - {app.type}</h5>
          <p>Current Status: <strong>{app.status}</strong></p>
          <p>Amount: ${app.amount.toLocaleString()}</p>
          <p>Submitted On: {new Date(app.submittedDate).toLocaleDateString()}</p>

          <div className="status-tracker">
            {getStatusSteps(app.status).map((step) => (
              <div
                key={step.key}
                className={`status-step ${step.state} ${step.isFailed ? 'failed' : ''}`}
              >
                <h5>{step.name}</h5>
                {step.state === 'current' && <p>Your application is currently at this stage.</p>}
                {step.state === 'completed' && <p>Completed.</p>}
                {step.isFailed && <p className="error-message">Application {app.status}.</p>}
                {step.key === 'documents' && app.documents.length === 0 && app.status === 'Documents Required' && (
                    <p className="info-message">Please upload your required documents.</p>
                )}
                {step.key === 'doc_review' && app.documentVerificationStatus === 'Failed' && (
                    <p className="error-message">Document verification failed. Please review and re-upload.</p>
                )}
                {step.key === 'credit_check' && app.creditScore < 600 && app.creditCheckStatus === 'Completed' && (
                  <p className="error-message">Credit score below threshold: {app.creditScore}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationStatusTracker;