import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';

const ApplicationStatusDisplay = ({ appId: propAppId }) => {
  const { id } = useParams();
  const actualAppId = propAppId || id;
  const { getApplicationById, applications } = useApplications();
  const { isLoggedIn, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (!checkAuth('applicant')) {
      navigate('/login');
    }
  }, [isLoggedIn, checkAuth, navigate]);

  useEffect(() => {
    if (actualAppId) {
      setApplication(applications.find(app => app.id === actualAppId));
    }
  }, [actualAppId, applications]);

  if (!isLoggedIn) {
    return null;
  }

  if (applications.length === 0) {
    return (
      <div className="card message-info">
        <p>You have not submitted any applications yet.</p>
        <Link to="/loan-application-portal"><button>Start a New Application</button></Link>
      </div>
    );
  }

  if (!actualAppId) {
    return (
      <div className="card">
        <h3>My Applications</h3>
        <p>Select an application to view its status:</p>
        <ul className="document-list">
          {applications.map(app => (
            <li key={app.id}>
              <Link to={`/application-status/${app.id}`}>
                {app.applicantName} - Loan for ${app.loanAmount}
              </Link>
              <span className={`status-badge ${app.status}`}>
                {app.status.replace('-', ' ')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="card message-error">
        <p>Application with ID "{actualAppId}" not found.</p>
        <Link to="/application-status"><button className="button-secondary">Back to My Applications</button></Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h4>Application Status for {application.applicantName}</h4>
      <div className="detail-section">
        <div className="detail-item"><strong>Application ID:</strong> {application.id}</div>
        <div className="detail-item"><strong>Loan Type:</strong> {application.loanType}</div>
        <div className="detail-item"><strong>Loan Amount:</strong> ${application.loanAmount.toLocaleString()}</div>
        <div className="detail-item">
          <strong>Status:</strong>
          <span className={`status-badge ${application.status}`} style={{ marginLeft: '10px' }}>
            {application.status.replace('-', ' ')}
          </span>
        </div>
        <div className="detail-item"><strong>Submission Date:</strong> {new Date(application.submissionDate).toLocaleString()}</div>
        <div className="detail-item"><strong>Last Updated:</strong> {new Date(application.lastUpdated).toLocaleString()}</div>
      </div>

      {application.documents.length > 0 && (
        <div className="detail-section">
          <h5>Documents</h5>
          <ul className="document-list">
            {application.documents.map((doc, index) => (
              <li key={index}>
                <span>{doc.name}</span>
                <span className={`status-badge ${doc.status}`}>
                  {doc.status.replace('-', ' ')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusDisplay;