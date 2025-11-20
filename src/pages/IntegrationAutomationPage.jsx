import React from 'react';
import UserStoryBlock from '../components/UserStoryBlock';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const IntegrationAutomationPage = () => {
  const { isLoggedIn, checkAuth } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!checkAuth('officer')) {
      navigate('/login');
    }
  }, [isLoggedIn, checkAuth, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="app-main">
      <h2 className="page-title">Integration & Automation Services</h2>

      <UserStoryBlock
        title="Credit Bureau Integration"
        description="Automate credit history retrieval and scoring using external APIs for faster and more accurate decisions. (Integrated into Application Detail View for loan officers.)"
      >
        <p className="message-info">
          The "Automated Credit Check" task is implemented and accessible within the "Application Details"
          view on the Loan Officer Dashboard. Loan officers can trigger a mock credit check for each application.
        </p>
        <p>
          Navigate to the <a href="/loan-officer-dashboard" style={{color: var('--color-accent')}}>Loan Officer Dashboard</a>,
          select an application, and you will find the Credit Check widget there.
        </p>
      </UserStoryBlock>

      <UserStoryBlock
        title="Core Banking Approval Workflow Integration"
        description="Enable seamless submission of approved loan applications to the bank’s core system for disbursement. (Integrated into Application Detail View for loan officers.)"
      >
        <p className="message-info">
          The "Submit Approved Application to Core System" task is implemented and accessible within the "Application Details"
          view on the Loan Officer Dashboard. This action becomes available for approved applications.
        </p>
        <p>
          Navigate to the <a href="/loan-officer-dashboard" style={{color: var('--color-accent')}}>Loan Officer Dashboard</a>,
          select an *approved* application, and you will find the Core Banking Submission widget there.
        </p>
      </UserStoryBlock>
    </div>
  );
};

export default IntegrationAutomationPage;