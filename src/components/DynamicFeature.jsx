import React from 'react';
import LoginForm from './forms/LoginForm';
import LoanApplicationForm from './forms/LoanApplicationForm';
import DocumentUploader from './uploads/DocumentUploader';
import ApplicationStatusTracker from './status/ApplicationStatusTracker';
import OcrExtractionMock from './mocks/OcrExtractionMock';
import CreditCheckMock from './mocks/CreditCheckMock';
import DecisionEngineMock from './mocks/DecisionEngineMock';
import ComplianceMock from './mocks/ComplianceMock';
import NotificationSimulator from './mocks/NotificationSimulator';
import Button from './ui/Button';

const DynamicFeature = ({ task, applicationData, onUpdateApplication, onLogin, isAuthenticated }) => {
  const taskTitle = task.title.toLowerCase();
  const taskDescription = task.description.toLowerCase();

  if (taskTitle.includes('login') || taskDescription.includes('authenticate')) {
    return <LoginForm onLogin={onLogin} isAuthenticated={isAuthenticated} task={task} />;
  }
  if (taskTitle.includes('submit personal loan application')) {
    return <LoanApplicationForm onUpdateApplication={onUpdateApplication} task={task} />;
  }
  if (taskTitle.includes('upload identity and income documents')) {
    return <DocumentUploader onUpdateApplication={onUpdateApplication} task={task} />;
  }
  if (taskTitle.includes('view loan application status')) {
    return <ApplicationStatusTracker applicationData={applicationData} task={task} />;
  }

  if (taskTitle.includes('automatic extraction of data from documents') || taskDescription.includes('ocr')) {
    return <OcrExtractionMock onUpdateApplication={onUpdateApplication} task={task} />;
  }
  if (taskTitle.includes('notify applicant of document verification status')) {
    return <NotificationSimulator notificationType="document_verification" onUpdateApplication={onUpdateApplication} task={task} />;
  }
  if (taskTitle.includes('initiate automated credit check')) {
    return <CreditCheckMock onUpdateApplication={onUpdateApplication} task={task} />;
  }
  if (taskTitle.includes('automatic loan approval/rejection')) {
    return <DecisionEngineMock onUpdateApplication={onUpdateApplication} task={task} />;
  }
  if (taskTitle.includes('automated compliance validation')) {
    return <ComplianceMock onUpdateApplication={onUpdateApplication} task={task} />;
  }
  if (taskTitle.includes('applicant receives status update notifications')) {
    return <NotificationSimulator notificationType="application_status" onUpdateApplication={onUpdateApplication} task={task} />;
  }
  if (taskTitle.includes('employee receives reminder for pending tasks')) {
    return <NotificationSimulator notificationType="internal_reminder" onUpdateApplication={onUpdateApplication} task={task} />;
  }

  return (
    <div className="mock-feature">
      <p><em>Mock implementation for: {task.title}</em></p>
      <p>Description: {task.description}</p>
      <p>Acceptance Criteria:</p>
      <ul>
        {task.acceptance_criteria.map((criteria, i) => (
          <li key={i}>{criteria}</li>
        ))}
      </ul>
      <Button onClick={() => alert(`Simulating: ${task.title}`)}>Simulate Action</Button>
    </div>
  );
};

export default DynamicFeature;