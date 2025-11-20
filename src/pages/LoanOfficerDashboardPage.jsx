import React from 'react';
import UserStoryBlock from '../components/UserStoryBlock';
import ApplicationList from '../components/dashboard/ApplicationList';
import ApplicationDetailView from '../components/dashboard/ApplicationDetailView';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const LoanOfficerDashboardPage = () => {
  const { isLoggedIn, checkAuth } = useAuth();
  const { id } = useParams();
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
      <h2 className="page-title">Loan Officer & Underwriter Dashboard</h2>

      {id ? (
        <ApplicationDetailView />
      ) : (
        <>
          <UserStoryBlock
            title="Dashboard for Application Management"
            description="A unified dashboard for viewing, filtering, and prioritizing loan applications."
          >
            <ApplicationList />
          </UserStoryBlock>

          <UserStoryBlock
            title="Automated Document & Identity Verification"
            description="Use OCR and third-party APIs to verify applicant identity and document authenticity, flagging risks and reducing manual entry. (Tasks integrated into Application Detail View.)"
          >
            <p className="message-info">
              The tasks "Automatic OCR Processing" and "Manual Verification Fallback" are implemented
              and accessible when viewing individual application details.
            </p>
            <p>
              Please select an application from the list above to proceed with document verification.
            </p>
          </UserStoryBlock>
        </>
      )}
    </div>
  );
};

export default LoanOfficerDashboardPage;