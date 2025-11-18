import React, { useState } from 'react';

const mockApplications = [
  { id: 'APP001', applicant: 'Alice Johnson', amount: 15000, date: '2023-03-10', status: 'Under Review', creditScore: null, creditReport: null },
  { id: 'APP002', applicant: 'Bob Williams', amount: 25000, date: '2023-03-12', status: 'Under Review', creditScore: null, creditReport: null },
  { id: 'APP003', applicant: 'Charlie Brown', amount: 5000, date: '2023-03-08', status: 'Approved', creditScore: 780, creditReport: 'Good payment history.' },
  { id: 'APP004', applicant: 'Diana Prince', amount: 30000, date: '2023-03-15', status: 'Rejected', creditScore: 550, creditReport: 'High debt-to-income ratio.' }
];

const CreditCheckApiTask = ({ task }) => {
  const [applications, setApplications] = useState(mockApplications);
  const [loadingAppId, setLoadingAppId] = useState(null);
  const [selectedAppDetails, setSelectedAppDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const simulateCreditCheck = (appId) => {
    setLoadingAppId(appId);
    console.log(`Simulating API request for application ${appId} for compliance logging.`);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% chance of success
      let newCreditScore = null;
      let newCreditReport = 'N/A';
      let errorMessage = null;

      if (isSuccess) {
        newCreditScore = Math.floor(Math.random() * (850 - 600 + 1)) + 600; // Score between 600-850
        newCreditReport = `Credit score: ${newCreditScore}. Report summary: Good payment history, few inquiries.`;
      } else {
        errorMessage = 'Credit Bureau API unavailable or applicant data mismatch.';
        newCreditReport = 'Failed to retrieve credit report.';
      }

      setApplications(prevApps => prevApps.map(app =>
        app.id === appId
          ? { ...app, creditScore: newCreditScore, creditReport: newCreditReport, errorMessage: errorMessage }
          : app
      ));
      setLoadingAppId(null);
    }, 2500); // Simulate API call delay
  };

  const viewDetails = (app) => {
    setSelectedAppDetails(app);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppDetails(null);
  };

  return (
    <div>
      <h5>{task.title}</h5>
      <p>This section simulates fetching credit scores for loan applications, typically for a loan officer's dashboard.</p>

      <div className="data-table-container">
        <table>
          <thead>
            <tr>
              <th>App ID</th>
              <th>Applicant</th>
              <th>Status</th>
              <th>Credit Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.applicant}</td>
                <td><span className={`status-indicator ${app.status.toLowerCase().replace(/ /g, '-')}`}>{app.status}</span></td>
                <td>
                  {loadingAppId === app.id ? 'Fetching...' : (app.creditScore || 'N/A')}
                </td>
                <td>
                  {app.creditScore === null && app.status === 'Under Review' && loadingAppId !== app.id ? (
                    <button onClick={() => simulateCreditCheck(app.id)}>Run Credit Check</button>
                  ) : (
                    <button onClick={() => viewDetails(app)} disabled={loadingAppId === app.id}>
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedAppDetails && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Application Details: {selectedAppDetails.applicant} ({selectedAppDetails.id})</h5>
            <p><strong>Loan Amount:</strong> ${selectedAppDetails.amount.toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedAppDetails.status}</p>
            <p><strong>Credit Score:</strong> {selectedAppDetails.creditScore || 'Not yet checked'}</p>
            <p><strong>Credit Report Summary:</strong> {selectedAppDetails.creditReport || 'No report available.'}</p>
            {selectedAppDetails.errorMessage && (
              <p className="error-message"><strong>Error:</strong> {selectedAppDetails.errorMessage}</p>
            )}
            <p style={{marginTop: '20px', fontSize: '0.8em', color: '#aaa'}}>
                <em>(Mock: System logs each API request for compliance.)</em>
            </p>
            <button onClick={closeModal}>Close Details</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditCheckApiTask;