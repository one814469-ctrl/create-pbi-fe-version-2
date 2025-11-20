import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';

const AuditTrailViewer = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications } = useLoan();
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [applicationAudit, setApplicationAudit] = useState(null);

  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter' && user?.role !== 'manager')) {
    displayMessage('error', 'Access Denied', 'You need loan management permissions to view the audit trail.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Application Audit Trail</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only loan officers, underwriters, and managers can view the audit trail.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (selectedApplicationId) {
      const app = applications.find(a => a.id === selectedApplicationId);
      setApplicationAudit(app || null);
    } else {
      setApplicationAudit(null);
    }
  }, [selectedApplicationId, applications]);

  const handleSearch = (e) => {
    e.preventDefault();
    const appId = e.target.elements.appId.value.trim();
    if (appId) {
      setSelectedApplicationId(appId);
      const app = applications.find(a => a.id.toLowerCase() === appId.toLowerCase());
      if (!app) {
        displayMessage('info', 'No Application Found', `No application found with ID "${appId}".`);
      }
    } else {
      setSelectedApplicationId('');
      displayMessage('info', 'Search Cleared', 'Please enter an Application ID to view its audit trail.');
    }
  };

  const currentApp = applicationAudit;

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">Application Audit Trail</h3>
        <p className="card-description">View all changes and approval/rejection events on an application.</p>
      </div>
      <div className="card-content space-y-6">
        <form onSubmit={handleSearch} className="flex-row items-end space-x-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="appId" className="block text-sm font-medium">Enter Application ID</label>
            <input
              id="appId"
              type="text"
              placeholder="e.g., LA001, LA002"
              value={selectedApplicationId}
              onChange={(e) => setSelectedApplicationId(e.target.value)}
              className="w-full"
            />
          </div>
          <button type="submit">View Audit Trail</button>
        </form>

        {currentApp ? (
          <div>
            <h6 className="text-lg font-semibold mb-2">Audit Trail for Application {currentApp.id} ({currentApp.customerName})</h6>
            {currentApp.auditTrail && currentApp.auditTrail.length > 0 ? (
              <div className="scroll-area">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User/System</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApp.auditTrail
                      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                      .map((entry, index) => (
                        <tr key={index}>
                          <td className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</td>
                          <td className="font-medium">{entry.user}</td>
                          <td>{entry.action}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground italic">No audit trail events recorded for this application yet.</p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground italic">Enter an Application ID to view its audit history.</p>
        )}
      </div>
    </div>
  );
};

export default AuditTrailViewer;