import React from 'react';
import AuthForm from './tasks/AuthForm';
import LoanApplicationForm from './tasks/LoanApplicationForm';
import DocumentUpload from './tasks/DocumentUpload';
import ApplicationStatusTracker from './tasks/ApplicationStatusTracker';
import OCRProcessorMock from './tasks/OCRProcessorMock';
import NotificationDisplayTrigger from './tasks/NotificationDisplayTrigger';
import CreditCheckInitiator from './tasks/CreditCheckInitiator';
import CreditScoreDisplay from './tasks/CreditScoreDisplay';
import DecisionEngineSimulator from './tasks/DecisionEngineSimulator';
import ComplianceValidator from './tasks/ComplianceValidator';
import ApplicationSearchFilter from './tasks/ApplicationSearchFilter';
import AuditTrailViewer from './tasks/AuditTrailViewer';
import ReportGenerator from './tasks/ReportGenerator';
import CSATDashboard from './tasks/CSATDashboard';

const taskComponentMap = {
  "User login via FinTrust SSO": AuthForm,
  "Submit personal loan application": LoanApplicationForm,
  "Upload identity and income documents": DocumentUpload,
  "View loan application status": ApplicationStatusTracker,
  "Automatic extraction of data from documents": OCRProcessorMock,
  "Notify applicant of document verification status": NotificationDisplayTrigger, // Generic notif trigger
  "Initiate automated credit check": CreditCheckInitiator,
  "Loan officer views applicant credit score": CreditScoreDisplay,
  "Automatic loan approval/rejection based on criteria": DecisionEngineSimulator,
  "Automated compliance validation": ComplianceValidator,
  "Search loan applications by customer name or ID": ApplicationSearchFilter,
  "View application history and actions": AuditTrailViewer,
  "Applicant receives status update notifications": NotificationDisplayTrigger, // Generic notif trigger
  "Employee receives reminder for pending tasks": NotificationDisplayTrigger, // Generic notif trigger
  "Generate loan application processing report": ReportGenerator,
  "View aggregated customer satisfaction metrics": CSATDashboard,
};

const DynamicTaskFeature = ({ task, displayMessage }) => {
  const TaskComponent = taskComponentMap[task.title];

  if (TaskComponent) {
    // Pass task details and the global message display function
    return <TaskComponent task={task} displayMessage={displayMessage} />;
  } else {
    return <p className="info-message">Implementation for "{task.title}" is pending.</p>;
  }
};

export default DynamicTaskFeature;