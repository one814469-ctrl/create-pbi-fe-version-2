import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../common/Notification';
import { getLoanApplications } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import '../../styles/StatusTracker.css';

const statusSteps = [
  'Application Submitted',
  'Documents Under Review',
  'Credit Check Initiated',
  'Decision Pending',
  'Approved / Rejected',
];

function ApplicationStatusTracker() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      showNotification('Please log in to view application status.', 'warning');
      navigate('/epic/account-authentication-access');
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getLoanApplications();
        setApplications(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch applications. Please try again later.');
        showNotification('Failed to load application status.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isAuthenticated, navigate, showNotification]);

  const getProgress = (status) => {
    const currentIndex = statusSteps.indexOf(status);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / statusSteps.length) * 100;
  };

  if (loading) {
    return <Card title="Application Status"><p>Loading application data...</p></Card>;
  }

  if (error) {
    return <Card title="Application Status"><p className="error-message">{error}</p></Card>;
  }

  return (
    <Card title="Loan Application Status">
      <p>As an applicant, I want to see the real-time status of my loan application so that I can track its progress.</p>

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>You have no submitted applications yet.</p>
          <Button onClick={() => navigate('/epic/loan-application-submission')}>Start a New Application</Button>
        </div>
      ) : (
        <div className="application-list">
          {applications.map((app) => (
            <div key={app.id} className="application-status-item card">
              <h4 className="application-id">Application ID: {app.id}</h4>
              <p>Loan Amount: ${app.loanAmount}</p>
              <p>Purpose: {app.loanPurpose}</p>
              <div className="status-progress-section">
                <ProgressBar progress={getProgress(app.status)} label={`Current Status: ${app.status}`} />
                <ul className="status-timeline">
                  {statusSteps.map((step, index) => (
                    <li key={index} className={statusSteps.indexOf(app.status) >= index ? 'completed' : ''}>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              {app.status === 'Approved / Rejected' && (
                <p className={`final-decision ${app.decision === 'Approved' ? 'approved' : 'rejected'}`}>
                  Decision: {app.decision} {app.decision === 'Rejected' && `(${app.rejectionReason})`}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default ApplicationStatusTracker;