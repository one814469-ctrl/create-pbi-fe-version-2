import React from 'react';
import UserStoryBlock from '../components/UserStoryBlock';
import LoanApplicationForm from '../components/application/LoanApplicationForm';
import DocumentUpload from '../components/application/DocumentUpload';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';

const CustomerLoanApplicationPortalPage = () => {
  const { isLoggedIn, checkAuth } = useAuth();
  const { applications } = useApplications();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!checkAuth('applicant')) {
      navigate('/login');
    }
  }, [isLoggedIn, checkAuth, navigate]);

  const latestApplication = applications[applications.length - 1];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="app-main">
      <h2 className="page-title">Customer Loan Application Portal</h2>

      <UserStoryBlock
        title="Digital Loan Application Submission"
        description="Allow loan applicants to submit personal and loan information, upload documents, and review the application before submitting."
      >
        <LoanApplicationForm />
        {latestApplication && (
          <DocumentUpload appId={latestApplication.id} currentDocuments={latestApplication.documents} />
        )}
      </UserStoryBlock>

      <UserStoryBlock
        title="Automated Notifications and Reminders"
        description="Automatically notify applicants of key milestones, missing documents, and decision outcomes via email and SMS. (Notifications are simulated and logged to console in this demo.)"
      >
        <div className="card message-info">
          <p>
            Notification tasks (Application Submission Confirmation, Reminder for Missing Documents, Final Decision Notification)
            are handled internally by the system. Upon successful application submission or status changes,
            simulated notifications (email/SMS) are "sent" and logged to the browser console to demonstrate fulfillment of these tasks.
          </p>
          <p>
            For example, after submitting an application, check the console for a "Confirmation email and SMS sent" message.
          </p>
        </div>
      </UserStoryBlock>
    </div>
  );
};

export default CustomerLoanApplicationPortalPage;