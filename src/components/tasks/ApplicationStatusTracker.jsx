import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { useNavigate } from 'react-router-dom';

const ApplicationStatusTracker = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { getCustomerApplications } = useLoan();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    displayMessage('error', 'Authentication Required', 'You must be logged in to view application status.');
    return (
      <div className="card w-full max-w-lg mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">View Loan Application Status</p>
        </div>
        <div className="card-content">
          <p className="error-text">Please log in to view your application status.</p>
          <button onClick={() => navigate('/epics/account-authentication-access')} className="mt-4">Go to Login</button>
        </div>
      </div>
    );
  }

  const customerApplications = getCustomerApplications(user?.role === 'customer' ? user.customerID : null);

  if (customerApplications.length === 0) {
    return (
      <div className="card w-full max-w-2xl mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title">No Loan Applications Found</h3>
          <p className="card-description">You haven't submitted any applications yet.</p>
        </div>
        <div className="card-content">
          <p className="text-muted-foreground mb-4">It looks like you haven't submitted any loan applications yet.</p>
          <button onClick={() => navigate('/epics/loan-application-submission')}>Start a New Application</button>
        </div>
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
    if (status.includes('Documents Uploaded')) currentStepIndex = 1;
    if (status.includes('Document Review') || status.includes('Documents Verified') || status.includes('Manual Document Entry Required') || status.includes('Manual Document Review Required')) currentStepIndex = 2;
    if (status.includes('Credit Check') || status.includes('Manual Review Required (Credit)') || status.includes('Credit Score')) currentStepIndex = 3;
    if (status.includes('Compliance')) currentStepIndex = 4;
    if (status.includes('Approved') || status.includes('Rejected') || status.includes('Manual Review Required (Decision)')) currentStepIndex = 5;

    return steps.map((step, index) => {
      let state = 'pending';
      let isFailed = false;

      if (index < currentStepIndex) {
        state = 'completed';
      } else if (index === currentStepIndex) {
        state = 'current';
      }

      if (status === 'Rejected' && index === 5) {
        isFailed = true;
        state = 'failed';
      } else if ((step.key === 'doc_review' && (status === 'Manual Document Entry Required' || status === 'Manual Document Review Required')) && index === currentStepIndex) {
        state = 'current';
        isFailed = true;
      } else if ((step.key === 'credit_check' && status === 'Manual Review Required (Credit)') && index === currentStepIndex) {
        state = 'current';
        isFailed = true;
      } else if ((step.key === 'decision' && status === 'Manual Review Required (Decision)') && index === currentStepIndex) {
        state = 'current';
        isFailed = true;
      }

      return { ...step, state, isFailed };
    });
  };

  const getStatusBadgeClass = (status) => {
    if (status.includes('Approved')) return 'badge-default';
    if (status.includes('Rejected') || status.includes('Required') || status.includes('Manual')) return 'badge-destructive';
    return 'badge-secondary';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-primary-color md:text-2xl">Your Loan Applications</h3>
      {customerApplications.map((app) => (
        <div key={app.id} className="card w-full">
          <div className="card-header flex-row items-center justify-between">
            <h4 className="card-title text-xl">Application ID: {app.id}</h4>
            <span className={`badge ${getStatusBadgeClass(app.status)}`}>
              {app.status}
            </span>
          </div>
          <div className="card-content">
            <p className="text-muted-foreground">Type: {app.type}</p>
            <p className="text-muted-foreground mb-4">Amount: <span className="font-semibold text-primary">${app.amount.toLocaleString()}</span></p>

            <div className="space-y-4 pt-4 border-t border-border-default mt-4">
              {getStatusSteps(app.status).map((step) => (
                <div
                  key={step.key}
                  className={`status-step ${step.state} ${step.isFailed ? 'failed' : ''}`}
                >
                  {step.state === 'completed' && <span className="text-xl">✓</span>}
                  {step.state === 'current' && <span className="text-xl">●</span>}
                  {step.isFailed && <span className="text-xl">✕</span>}
                  {step.state === 'pending' && <span className="text-xl">○</span>}
                  <div>
                    <h6 className="font-semibold">{step.name}</h6>
                    {step.state === 'current' && <p className="text-sm">Your application is currently at this stage.</p>}
                    {step.isFailed && (
                      <p className="text-sm text-destructive">
                        {app.status === 'Rejected' ? `Application ${app.status}. Reason: ${app.creditReport}` :
                         app.status.includes('Documents Required') ? 'Action Required: Please upload your documents.' :
                         app.status.includes('Manual') ? 'Action Required: Manual review or correction needed.' : ''}
                      </p>
                    )}
                    {step.key === 'documents' && app.documents.length === 0 && app.status === 'Documents Required' && (
                        <p className="text-sm text-info">Please upload your required documents.</p>
                    )}
                    {step.key === 'doc_review' && app.documentVerificationStatus === 'Failed' && (
                        <p className="text-sm text-destructive">Document verification failed. Please review and re-upload.</p>
                    )}
                    {step.key === 'credit_check' && app.creditScore < 600 && app.creditCheckStatus === 'Completed' && (
                      <p className="text-sm text-destructive">Credit score below threshold: {app.creditScore}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationStatusTracker;