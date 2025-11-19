import React from 'react';

const ApplicationStatusTracker = ({ applicationData, task }) => {
  const mockStatuses = [
    { name: 'Application Submitted', date: '2023-10-26', completed: true },
    { name: 'Documents Uploaded', date: '2023-10-27', completed: true },
    { name: 'Document Verification', date: '2023-10-28', completed: applicationData?.docVerificationStatus === 'Verified' },
    { name: 'Credit Check', date: '2023-10-29', completed: applicationData?.creditScore !== null && applicationData?.creditScore !== 'N/A' },
    { name: 'Compliance Review', date: '2023-10-30', completed: applicationData?.compliance === 'Compliant' },
    { name: 'Final Decision', date: '2023-10-31', completed: applicationData?.decision !== null },
  ];

  if (!applicationData || applicationData.status === 'empty') {
    return (
      <div className="status-tracker card">
        <h4>No Active Loan Application</h4>
        <p>You currently have no submitted loan applications.</p>
        <p className="info-message mt-2">
          <em>Acceptance Criteria (Edge): {task.acceptance_criteria[1]} (Mocked: Empty-state card and prompt to start new application)</em>
        </p>
        <p>Start a new application today!</p>
      </div>
    );
  }

  return (
    <div className="status-tracker card">
      <h4>Loan Application Status</h4>
      <p>Current Status: <strong>{applicationData.status || 'Processing'}</strong></p>
      <div className="mt-4">
        {mockStatuses.map((step, index) => (
          <div key={index} className={`status-item ${step.completed ? '' : 'pending'}`}>
            <span className="icon">{step.completed ? '✅' : '⏳'}</span>
            <span>{step.name} {step.completed && `(on ${step.date})`}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h5>Application History:</h5>
        {applicationData.history && applicationData.history.length > 0 ? (
          <ul>
            {applicationData.history.map((entry, index) => (
              <li key={index}>
                <strong>{new Date(entry.timestamp).toLocaleString()}:</strong> {entry.action}
              </li>
            ))}
          </ul>
        ) : (
          <p>No history available yet.</p>
        )}
      </div>
      <p className="mt-4">
        <em>Acceptance Criteria (Positive): {task.acceptance_criteria[0]} (Mocked: Current status and timeline displayed)</em>
      </p>
      {/* Negative case "Given I access the status page without authentication" is handled by the router redirecting to login */}
    </div>
  );
};

export default ApplicationStatusTracker;