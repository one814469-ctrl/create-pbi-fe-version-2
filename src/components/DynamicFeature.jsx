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

  // --- Customer-facing features ---
  if (taskTitle.includes('login') || taskDescription.includes('authenticate')) {
    return <LoginForm onLogin={onLogin} isAuthenticated={isAuthenticated} />;
  }
  if (taskTitle.includes('submit personal loan application')) {
    return <LoanApplicationForm onUpdateApplication={onUpdateApplication} />;
  }
  if (taskTitle.includes('upload identity and income documents')) {
    return <DocumentUploader onUpdateApplication={onUpdateApplication} />;
  }
  if (taskTitle.includes('view loan application status')) {
    return <ApplicationStatusTracker applicationData={applicationData} />;
  }

  // --- Internal/System features (often mocked interactions) ---
  if (taskTitle.includes('automatic extraction of data from documents') || taskDescription.includes('ocr')) {
    return <OcrExtractionMock onUpdateApplication={onUpdateApplication} />;
  }
  if (taskTitle.includes('notify applicant of document verification status')) {
    return <NotificationSimulator notificationType="document_verification" onUpdateApplication={onUpdateApplication} />;
  }
  if (taskTitle.includes('initiate automated credit check')) {
    return <CreditCheckMock onUpdateApplication={onUpdateApplication} />;
  }
  if (taskTitle.includes('automatic loan approval/rejection')) {
    return <DecisionEngineMock onUpdateApplication={onUpdateApplication} />;
  }
  if (taskTitle.includes('automated compliance validation')) {
    return <ComplianceMock onUpdateApplication={onUpdateApplication} />;
  }
  if (taskTitle.includes('applicant receives status update notifications')) {
    return <NotificationSimulator notificationType="application_status" onUpdateApplication={onUpdateApplication} />;
  }
  if (taskTitle.includes('employee receives reminder for pending tasks')) {
    return <NotificationSimulator notificationType="internal_reminder" onUpdateApplication={onUpdateApplication} />;
  }
  // For tasks related to dashboards, search, audit trail, reports, etc.,
  // the parent page (e.g., InternalDashboardPage, ReportingPage) will
  // explicitly render the relevant components. This DynamicFeature is
  // primarily for interactive tasks that can be "triggered" or displayed
  // within a UserStoryBlock.

  // Default fallback for any unhandled task
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