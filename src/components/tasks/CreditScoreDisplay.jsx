import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';

const CreditScoreDisplay = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications } = useLoan();
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [displayAppData, setDisplayAppData] = useState(null);

  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'manager' && user?.role !== 'underwriter')) {
    displayMessage('error', 'Access Denied', 'You need loan officer/manager/underwriter permissions to view credit scores.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Display Credit Score to Loan Officers</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only loan officers, managers, and underwriters can view credit scores.</p>
        </div>
      </div>
    );
  }

  const eligibleApplications = applications.filter(app => app.creditCheckStatus === 'Completed');

  useEffect(() => {
    if (!selectedApplicationId && eligibleApplications.length > 0) {
      setSelectedApplicationId(eligibleApplications[0].id);
      setDisplayAppData(eligibleApplications[0]);
    } else if (selectedApplicationId) {
      const currentApp = applications.find(a => a.id === selectedApplicationId);
      if (currentApp?.creditCheckStatus === 'Completed') {
        setDisplayAppData(currentApp);
      } else {
        setSelectedApplicationId('');
        setDisplayAppData(null);
      }
    }
  }, [applications, selectedApplicationId, eligibleApplications]);

  const handleSelectApplication = (e) => {
    const id = e.target.value;
    setSelectedApplicationId(id);
    const app = applications.find(a => a.id === id);
    setDisplayAppData(app);
  };

  if (eligibleApplications.length === 0) {
    return (
      <div className="card w-full">
        <div className="card-header">
          <h3 className="card-title">Applicant Credit Score</h3>
          <p className="card-description">Show applicant credit score and details in the management dashboard.</p>
        </div>
        <div className="card-content">
          <p className="text-muted-foreground italic">No applications with completed credit checks to display yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please use the "Initiate automated credit check" task to process an application first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">Applicant Credit Score</h3>
        <p className="card-description">Show applicant credit score and details in the management dashboard.</p>
      </div>
      <div className="card-content space-y-6">
        <div className="space-y-2">
          <label htmlFor="selectApp" className="block text-sm font-medium">Select Application</label>
          <select
            id="selectApp"
            value={selectedApplicationId}
            onChange={handleSelectApplication}
            className="w-full"
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
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Details for {displayAppData.customerName} (ID: {displayAppData.id})</h6>
            <p>Credit Score: <strong className={displayAppData.creditScore < 600 ? "text-destructive text-xl" : "text-primary text-xl"}>{displayAppData.creditScore}</strong></p>
            <p className="text-muted-foreground">Credit Report Summary: {displayAppData.creditReport}</p>

            {displayAppData.creditScore < 600 && (
              <span className="badge badge-destructive text-wrap block mt-2 p-2">
                FLAGGED FOR REJECTION: Credit score {displayAppData.creditScore} is below the minimum threshold (e.g., 600).
                Loan officers should annotate the application with reasons for rejection.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditScoreDisplay;