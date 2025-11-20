import React from 'react';
import AuthForm from '@/components/tasks/AuthForm';
import LoanApplicationForm from '@/components/tasks/LoanApplicationForm';
import DocumentUpload from '@/components/tasks/DocumentUpload';
import ApplicationStatusTracker from '@/components/tasks/ApplicationStatusTracker';
import OCRProcessorMock from '@/components/tasks/OCRProcessorMock';
import NotificationDisplayTrigger from '@/components/tasks/NotificationDisplayTrigger';
import CreditCheckInitiator from '@/components/tasks/CreditCheckInitiator';
import CreditScoreDisplay from '@/components/tasks/CreditScoreDisplay';
import DecisionEngineSimulator from '@/components/tasks/DecisionEngineSimulator';
import ComplianceValidator from '@/components/tasks/ComplianceValidator';
import ApplicationSearchFilter from '@/components/tasks/ApplicationSearchFilter';
import AuditTrailViewer from '@/components/tasks/AuditTrailViewer';
import ReportGenerator from '@/components/tasks/ReportGenerator';
import CSATDashboard from '@/components/tasks/CSATDashboard';
import { CardDescription } from '@/components/ui/card';

const taskComponentMap = {
  "User login via FinTrust SSO": AuthForm,
  "Submit personal loan application": LoanApplicationForm,
  "Upload identity and income documents": DocumentUpload,
  "View loan application status": ApplicationStatusTracker,
  "Automatic extraction of data from documents": OCRProcessorMock,
  "Notify applicant of document verification status": NotificationDisplayTrigger,
  "Initiate automated credit check": CreditCheckInitiator,
  "Loan officer views applicant credit score": CreditScoreDisplay,
  "Automatic loan approval/rejection based on criteria": DecisionEngineSimulator,
  "Automated compliance validation": ComplianceValidator,
  "Search loan applications by customer name or ID": ApplicationSearchFilter,
  "View application history and actions": AuditTrailViewer,
  "Applicant receives status update notifications": NotificationDisplayTrigger,
  "Employee receives reminder for pending tasks": NotificationDisplayTrigger,
  "Generate loan application processing report": ReportGenerator,
  "View aggregated customer satisfaction metrics": CSATDashboard,
};

const DynamicTaskFeature = ({ task, displayMessage }) => {
  const TaskComponent = taskComponentMap[task.title];

  if (TaskComponent) {
    return <TaskComponent task={task} displayMessage={displayMessage} />;
  } else {
    return (
      <CardDescription className="text-sm text-muted-foreground italic">
        Implementation for "{task.title}" is pending.
      </CardDescription>
    );
  }
};

export default DynamicTaskFeature;