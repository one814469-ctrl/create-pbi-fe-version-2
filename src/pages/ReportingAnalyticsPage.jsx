import React from 'react';
import UserStoryBlock from '../components/UserStoryBlock';
import KPIDashboardContent from '../components/reporting/KPIDashboardContent';
import AuditTrailDisplay from '../components/reporting/AuditTrailDisplay';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';

const ReportingAnalyticsPage = () => {
  const { isLoggedIn, checkAuth } = useAuth();
  const { applications } = useApplications();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!checkAuth('compliance')) {
      navigate('/login');
    }
  }, [isLoggedIn, checkAuth, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="app-main">
      <h2 className="page-title">Reporting, Analytics & Compliance</h2>

      <UserStoryBlock
        title="Loan Processing Analytics"
        description="Generate reports on loan volume, approval rates, turnaround time, and manual intervention to measure business objectives."
      >
        <KPIDashboardContent />
      </UserStoryBlock>

      <UserStoryBlock
        title="Audit & Activity Logs"
        description="Track and log all application-related actions for regulatory compliance and internal review. (Viewable per application for compliance and loan officers.)"
      >
        <p className="message-info">
          The "View Application Audit Trail" task is primarily integrated into the
          <a href="/loan-officer-dashboard" style={{color: var('--color-accent')}}> Loan Officer Dashboard</a>, where compliance officers
          (or loan officers with appropriate permissions) can view the audit trail for each individual application.
        </p>
        <p>
          Below is a demonstration for the first available application's audit trail:
        </p>
        {applications.length > 0 ? (
          <div className="card">
            <h4>Audit Trail for Application: {applications[0].id}</h4>
            <AuditTrailDisplay appId={applications[0].id} />
          </div>
        ) : (
          <div className="card message-info">No applications available to show audit trail.</div>
        )}
      </UserStoryBlock>
    </div>
  );
};

export default ReportingAnalyticsPage;