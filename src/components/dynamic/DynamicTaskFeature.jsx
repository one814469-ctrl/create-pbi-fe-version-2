import React from 'react';
import LoanApplicationFormTask from '../task-implementations/LoanApplicationFormTask';
import ApplicationStatusTrackerTask from '../task-implementations/ApplicationStatusTrackerTask';
import DocumentUploadOcrTask from '../task-implementations/DocumentUploadOcrTask';
import CreditCheckApiDisplayTask from '../task-implementations/CreditCheckApiDisplayTask';
import NotificationSenderTask from '../task-implementations/NotificationSenderTask';
import ReportingDashboardTask from '../task-implementations/ReportingDashboardTask';

const DynamicTaskFeature = ({ task }) => {
  const renderTaskContent = () => {
    switch (task.type) {
      case 'loan-application-form':
        return <LoanApplicationFormTask task={task} />;
      case 'status-tracker':
        return <ApplicationStatusTrackerTask task={task} />;
      case 'document-upload-ocr':
        return <DocumentUploadOcrTask task={task} />;
      case 'credit-check-display':
        return <CreditCheckApiDisplayTask task={task} />;
      case 'notification-sender':
        return <NotificationSenderTask task={task} />;
      case 'reporting-dashboard':
        return <ReportingDashboardTask task={task} />;
      default:
        return <p style={{color: 'var(--color-error)'}}>Error: No specific implementation for task type: "{task.type}"</p>;
    }
  };

  return (
    <div className="dynamic-task-feature">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div className="task-content" style={{ flexGrow: 1 }}>
        {renderTaskContent()}
      </div>
      <div className="acceptance-criteria">
        <h5>Acceptance Criteria:</h5>
        <ul>
          {task.acceptance_criteria.map((criteria, index) => (
            <li key={index}>{criteria}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DynamicTaskFeature;