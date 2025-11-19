import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useNotification } from '../common/Notification';
import { getLoanApplications, getCreditReport, getApplicationAuditTrail } from '../../utils/api';
import '../../styles/Dashboard.css';

function LoanOfficerDashboard() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getLoanApplications();
        setApplications(data);
        setFilteredApplications(data);
      } catch (error) {
        showNotification('Failed to load applications.', 'error');
      }
    };
    fetchApplications();
  }, [showNotification]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = applications.filter(
      (app) =>
        app.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
        app.id.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredApplications(results);
    if (searchTerm && results.length === 0) {
      showNotification('No applications found for your search.', 'info');
    }
  }, [searchTerm, applications, showNotification]);

  const handleViewDetails = async (appId) => {
    try {
      const app = applications.find((a) => a.id === appId);
      if (app) {
        const creditReport = app.creditChecked ? await getCreditReport(appId) : null;
        const auditTrail = await getApplicationAuditTrail(appId);
        setSelectedApplication({ ...app, creditReport, auditTrail });
        setActiveTab('details');
      }
    } catch (error) {
      showNotification(`Failed to load details for application ${appId}.`, 'error');
    }
  };

  const renderApplicationDetails = () => {
    if (!selectedApplication) return null;

    return (
      <div className="application-detail-view card">
        <h3 className="section-header">Application Details: {selectedApplication.id}</h3>
        <div className="tabs">
          <Button
            onClick={() => setActiveTab('details')}
            variant={activeTab === 'details' ? 'primary' : 'secondary'}
          >
            Details
          </Button>
          <Button
            onClick={() => setActiveTab('credit')}
            variant={activeTab === 'credit' ? 'primary' : 'secondary'}
          >
            Credit Score
          </Button>
          <Button
            onClick={() => setActiveTab('audit')}
            variant={activeTab === 'audit' ? 'primary' : 'secondary'}
          >
            Audit Trail
          </Button>
        </div>

        <div className="tab-content">
          {activeTab === 'details' && (
            <div className="detail-section">
              <p><strong>Applicant Name:</strong> {selectedApplication.fullName}</p>
              <p><strong>Email:</strong> {selectedApplication.email}</p>
              <p><strong>Loan Amount:</strong> ${selectedApplication.loanAmount}</p>
              <p><strong>Status:</strong> <span className={`status-${selectedApplication.status.toLowerCase().replace(/ /g, '-')}`}>{selectedApplication.status}</span></p>
              <p><strong>Decision:</strong> {selectedApplication.decision || 'N/A'}</p>
              {selectedApplication.decision === 'Rejected' && <p className="error-message"><strong>Reason:</strong> {selectedApplication.rejectionReason}</p>}
            </div>
          )}

          {activeTab === 'credit' && (
            <div className="detail-section">
              <h4>Credit Score & Report</h4>
              {selectedApplication.creditReport ? (
                <>
                  <p><strong>Credit Score:</strong> <span className={`score-${selectedApplication.creditReport.score >= 650 ? 'good' : 'bad'}`}>{selectedApplication.creditReport.score}</span></p>
                  <p><strong>Summary:</strong> {selectedApplication.creditReport.summary}</p>
                  {selectedApplication.creditReport.score < 600 && (
                    <p className="warning-message">Application flagged for rejection due to low credit score.</p>
                  )}
                  {selectedApplication.creditReport.flags.length > 0 && (
                    <div className="credit-flags">
                      <h5>Flags:</h5>
                      <ul>
                        {selectedApplication.creditReport.flags.map((flag, index) => (
                          <li key={index} className="warning-message">{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p>Credit check not yet performed or data unavailable.</p>
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="detail-section audit-trail">
              <h4>Application Audit Trail</h4>
              {selectedApplication.auditTrail && selectedApplication.auditTrail.length > 0 ? (
                <ul>
                  {selectedApplication.auditTrail.map((entry, index) => (
                    <li key={index}>
                      <strong>[{new Date(entry.timestamp).toLocaleString()}]</strong> by {entry.user}: {entry.action}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No audit trail available for this application.</p>
              )}
            </div>
          )}
        </div>
        <Button onClick={() => setSelectedApplication(null)} variant="secondary">Back to List</Button>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <Card title="Loan Application Search & Filters">
        <p>As a loan officer, I want to search and filter applications so that I can quickly find relevant cases.</p>
        <div className="search-filter-section">
          <Input
            placeholder="Search by customer name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setSearchTerm('')} variant="secondary">Clear Search</Button>
        </div>
      </Card>

      {selectedApplication ? (
        renderApplicationDetails()
      ) : (
        <Card title="All Loan Applications">
          {filteredApplications.length > 0 ? (
            <div className="application-table-container">
              <table className="application-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Applicant Name</th>
                    <th>Loan Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.id}</td>
                      <td>{app.fullName}</td>
                      <td>${app.loanAmount}</td>
                      <td><span className={`status-${app.status.toLowerCase().replace(/ /g, '-')}`}>{app.status}</span></td>
                      <td>
                        <Button onClick={() => handleViewDetails(app.id)} variant="secondary">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">No applications found.</p>
          )}
        </Card>
      )}
    </div>
  );
}

export default LoanOfficerDashboard;