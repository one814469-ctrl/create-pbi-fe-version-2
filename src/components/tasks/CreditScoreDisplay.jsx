import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';

const CreditScoreDisplay = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications } = useLoan();
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [displayAppData, setDisplayAppData] = useState(null);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'manager' && user?.role !== 'underwriter')) {
    displayMessage('error', 'Access denied. You need loan officer/manager/underwriter permissions to view credit scores.');
    return (
      <p className="error-message">
        Access Denied: Only loan officers, managers, and underwriters can view credit scores.
      </p>
    );
  }

  useEffect(() => {
    // Attempt to display an application by default if one exists and credit check is done
    const firstCompletedApp = applications.find(app => app.creditCheckStatus === 'Completed');
    if (firstCompletedApp && !selectedApplicationId) {
      setSelectedApplicationId(firstCompletedApp.id);
      setDisplayAppData(firstCompletedApp);
    }
  }, [applications, selectedApplicationId]);

  const handleSelectApplication = (e) => {
    const id = e.target.value;
    setSelectedApplicationId(id);
    const app = applications.find(a => a.id === id);
    setDisplayAppData(app);
  };

  // Filter applications that have completed credit checks
  const eligibleApplications = applications.filter(app => app.creditCheckStatus === 'Completed');

  // Acceptance Criteria: Given an application with completed credit check
  if (eligibleApplications.length === 0) {
    return (
      <div className="dashboard-card">
        <h5>Applicant Credit Score</h5>
        <p className="info-message">No applications with completed credit checks to display yet.</p>
        <p>Please use the "Initiate automated credit check" task to process an application first.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h5>Applicant Credit Score</h5>
      <div className="form-group">
        <label htmlFor="selectApp">Select Application:</label>
        <select
          id="selectApp"
          value={selectedApplicationId}
          onChange={handleSelectApplication}
        >
          <option value="">-- Select an Application --</option>
          {eligibleApplications.map(app => (
            <option key={app.id} value={app.id}>
              {app.customerName} ({app.id})
            </option>
          ))}
        </select>
      </div>

      {displayAppData && (
        <div style={{ marginTop: '1.5rem' }}>
          <h6>Details for {displayAppData.customerName} (ID: {displayAppData.id})</h6>
          {/* Acceptance Criteria: When I open the applicant file on dashboard, Then credit score and summary report are displayed */}
          <p>Credit Score: <strong>{displayAppData.creditScore}</strong></p>
          <p>Credit Report Summary: {displayAppData.creditReport}</p>

          {/* Acceptance Criteria: [Edge] Given credit score is below the minimum threshold */}
          {displayAppData.creditScore < 600 && ( // Example threshold
            <p className="error-message">
              <strong>FLAGGED FOR REJECTION:</strong> Credit score {displayAppData.creditScore} is below the minimum threshold (e.g., 600).
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CreditScoreDisplay;