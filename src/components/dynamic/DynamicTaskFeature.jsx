import React from 'react';
import AuthForm from '../features/AuthForm';
import LoanApplicationForm from '../features/LoanApplicationForm';
import DocumentUpload from '../features/DocumentUpload';
import ApplicationStatusTracker from '../features/ApplicationStatusTracker';
import OCRDataDisplay from '../features/OCRDataDisplay';
import DocumentVerificationStatus from '../features/DocumentVerificationStatus';
import CreditCheckSimulator from '../features/CreditCheckSimulator';
import LoanOfficerDashboard from '../features/LoanOfficerDashboard';
import AutomatedDecisionEngine from '../features/AutomatedDecisionEngine';
import ComplianceValidationDisplay from '../features/ComplianceValidationDisplay';
import NotificationSettings from '../features/NotificationSettings';
import ReportingDashboard from '../features/ReportingDashboard';
import '../../styles/App.css';

function DynamicTaskFeature({ task }) {
  const renderTaskComponent = () => {
    switch (task.title) {
      case 'User login via FinTrust SSO':
        return <AuthForm />;
      case 'Submit personal loan application':
        return <LoanApplicationForm />;
      case 'Upload identity and income documents':
        return <DocumentUpload />;
      case 'View loan application status':
        return <ApplicationStatusTracker />;
      case 'Automatic extraction of data from documents':
        return <OCRDataDisplay />;
      case 'Notify applicant of document verification status':
        return <DocumentVerificationStatus />;
      case 'Initiate automated credit check':
        return <CreditCheckSimulator />;
      case 'Display Credit Score to Loan Officers':
      case 'Search loan applications by customer name or ID':
      case 'View application history and actions':
        return <LoanOfficerDashboard />;
      case 'Automatic loan approval/rejection based on criteria':
        return <AutomatedDecisionEngine />;
      case 'Automated compliance validation':
        return <ComplianceValidationDisplay />;
      case 'Applicant receives status update notifications':
      case 'Employee receives reminder for pending tasks':
        return <NotificationSettings />;
      case 'Generate loan application processing report':
      case 'View aggregated customer satisfaction metrics':
        return <ReportingDashboard />;
      default:
        return (
          <div className="task-feature">
            <h4>{task.title} (Mock Implementation)</h4>
            <p>{task.description}</p>
            <p>
              <em>This task is represented by mock UI/logic.
              Acceptance Criteria: {JSON.parse(task.acceptance_criteria || '[]').join(' | ')}</em>
            </p>
          </div>
        );
    }
  };

  return (
    <div className="task-feature">
      {renderTaskComponent()}
    </div>
  );
}

export default DynamicTaskFeature;