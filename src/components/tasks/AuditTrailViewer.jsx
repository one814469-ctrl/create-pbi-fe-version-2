import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';

const AuditTrailViewer = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications } = useLoan();

  // Acceptance Criteria: [Negative] Given a user without dashboard permissions
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter' && user?.role !== 'manager')) {
    displayMessage('error', 'Access denied. You need loan management permissions to view the audit trail.');
    return (
      <p className="error-message">
        Access Denied: Only loan officers, underwriters, and managers can view the audit trail.
      </p>
    );
  }

  // For this mock, we'll display the audit trail for the first application found,
  // or prompt to use search in the "Search & Filters" story.
  const applicationToDisplay = applications.find(app => app.auditTrail && app.auditTrail.length > 0);

  if (!applicationToDisplay) {
    return (
      <div className="info-message">
        No applications with audit trails found. Please submit an application or use the search feature
        in the "Loan Application Search & Filters" section to find a specific one.
      </div>
    );
  }

  // Acceptance Criteria: Given an existing application, When I open the audit trail tab
  // Then all actions, timestamps, and user details are displayed
  return (
    <div className="dashboard-card">
      <h5>Audit Trail for Application ID: {applicationToDisplay.id}</h5>
      <p>Customer: {applicationToDisplay.customerName}</p>
      {applicationToDisplay.auditTrail && applicationToDisplay.auditTrail.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicationToDisplay.auditTrail
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
              .map((entry, index) => (
                <tr key={index}>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                  <td>{entry.user}</td>
                  <td>{entry.action}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p className="info-message">No audit trail events recorded for this application yet.</p>
      )}
    </div>
  );
};

export default AuditTrailViewer;