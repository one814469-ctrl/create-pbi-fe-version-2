import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import FilterSearch from './FilterSearch';

const ApplicationList = () => {
  const { applications } = useApplications();
  const { isLoggedIn, userRole, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [filteredApplications, setFilteredApplications] = useState(applications);

  React.useEffect(() => {
    if (!checkAuth('officer')) {
      navigate('/login');
    }
  }, [isLoggedIn, checkAuth, navigate]);

  React.useEffect(() => {
    setFilteredApplications(applications);
  }, [applications]);

  if (!isLoggedIn || userRole !== 'officer') return null;

  const handleFilter = ({ status, applicantName, submissionDate }) => {
    let tempApps = [...applications];

    if (status && status !== 'all') {
      tempApps = tempApps.filter(app => app.status === status);
    }
    if (applicantName) {
      tempApps = tempApps.filter(app =>
        app.applicantName.toLowerCase().includes(applicantName.toLowerCase())
      );
    }
    if (submissionDate) {
      tempApps = tempApps.filter(app => {
        const appDate = new Date(app.submissionDate).toISOString().split('T')[0];
        return appDate === submissionDate;
      });
    }
    setFilteredApplications(tempApps);
  };

  return (
    <div>
      <FilterSearch onFilter={handleFilter} />

      <div className="list-container">
        <div className="list-header">
          <div>ID</div>
          <div>Applicant Name</div>
          <div>Loan Amount</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {filteredApplications.length === 0 ? (
          <div className="list-item" style={{justifyContent: 'center', gridTemplateColumns: '1fr'}}>
            No applications found matching your criteria.
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div key={app.id} className="list-item" onClick={() => navigate(`/loan-officer-dashboard/${app.id}`)}>
              <div>{app.id}</div>
              <div>{app.applicantName}</div>
              <div>${app.loanAmount.toLocaleString()}</div>
              <div>
                <span className={`status-badge ${app.status}`}>{app.status.replace('-', ' ')}</span>
              </div>
              <div>
                <button className="button-accent" onClick={(e) => { e.stopPropagation(); navigate(`/loan-officer-dashboard/${app.id}`); }}>View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationList;