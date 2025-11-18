import React, { useState } from 'react';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { mockCreditBureauApi } from '../../lib/api/mockApi';

const mockApplications = [
  { id: 'APP001', applicant: 'Alice Johnson', amount: 15000, date: '2023-03-10', status: 'Under Review', creditScore: null, creditReport: null },
  { id: 'APP002', applicant: 'Bob Williams', amount: 25000, date: '2023-03-12', status: 'Under Review', creditScore: null, creditReport: null },
  { id: 'APP003', applicant: 'Charlie Brown', amount: 5000, date: '2023-03-08', status: 'Approved', creditScore: 780, creditReport: 'Good payment history.' },
  { id: 'APP004', applicant: 'Diana Prince', amount: 30000, date: '2023-03-15', status: 'Rejected', creditScore: 550, creditReport: 'High debt-to-income ratio.' }
];

const CreditCheckApiDisplayTask = ({ task }) => {
  const showToast = useToast();
  const [applications, setApplications] = useState(mockApplications);
  const [loadingAppId, setLoadingAppId] = useState(null);
  const [selectedAppDetails, setSelectedAppDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { key: 'id', label: 'App ID', sortable: true },
    { key: 'applicant', label: 'Applicant Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (status) => <span className={`status-indicator ${status.toLowerCase().replace(/ /g, '-')}`}>{status}</span> },
    { key: 'creditScore', label: 'Credit Score', sortable: true, render: (score, row) => loadingAppId === row.id ? 'Fetching...' : (score || 'N/A') },
  ];

  const actionsColumn = {
    render: (row) => (
      <>
        {row.creditScore === null && row.status === 'Under Review' && loadingAppId !== row.id ? (
          <Button onClick={() => simulateCreditCheck(row.id)} disabled={loadingAppId === row.id} variant="accent" style={{fontSize: '0.9em', padding: '6px 10px'}}>
            Run Credit Check
          </Button>
        ) : (
          <Button onClick={() => viewDetails(row)} disabled={loadingAppId === row.id} variant="secondary" style={{fontSize: '0.9em', padding: '6px 10px'}}>
            View Details
          </Button>
        )}
      </>
    )
  };

  const simulateCreditCheck = async (appId) => {
    setLoadingAppId(appId);
    console.log(`System logs: Credit Bureau API request initiated for application ${appId}.`); // Compliance logging

    try {
      const result = await mockCreditBureauApi(appId);
      setApplications(prevApps => prevApps.map(app =>
        app.id === appId
          ? { ...app, creditScore: result.creditScore, creditReport: result.reportSummary, errorMessage: null }
          : app
      ));
      showToast(`Credit score fetched for ${appId}: ${result.creditScore}`, 'success');
    } catch (error) {
      setApplications(prevApps => prevApps.map(app =>
        app.id === appId
          ? { ...app, creditScore: null, creditReport: 'Failed to retrieve credit report.', errorMessage: error.message }
          : app
      ));
      showToast(`Credit check failed for ${appId}: ${error.message}`, 'error');
      console.error(`System logs: Credit Bureau API error for ${appId}:`, error.message); // Error logging
    } finally {
      setLoadingAppId(null);
    }
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
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-small)', marginBottom: 'var(--spacing-s)' }}>
        This table displays mock loan applications, allowing loan officers to trigger and view credit checks.
      </p>

      <Table
        columns={columns}
        data={applications}
        actionsColumn={actionsColumn}
        onRowClick={null} // Disable row click for detail modal, use button instead
      />

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={`Application Details: ${selectedAppDetails?.applicant} (${selectedAppDetails?.id})`}
        footer={<Button onClick={closeModal} variant="secondary">Close</Button>}
      >
        <p><strong>Loan Amount:</strong> ${selectedAppDetails?.amount.toLocaleString()}</p>
        <p><strong>Status:</strong> {selectedAppDetails?.status}</p>
        <p><strong>Credit Score:</strong> {selectedAppDetails?.creditScore || 'Not yet checked'}</p>
        <p><strong>Credit Report Summary:</strong> {selectedAppDetails?.creditReport || 'No report available.'}</p>
        {selectedAppDetails?.errorMessage && (
          <p className="error-message"><strong>Error:</strong> {selectedAppDetails.errorMessage}</p>
        )}
        <p style={{marginTop: 'var(--spacing-m)', fontSize: 'var(--font-size-small)', color: 'var(--color-muted)'}}>
            <em>(Mock: System logs each API request for compliance.)</em>
        </p>
      </Modal>
    </div>
  );
};

export default CreditCheckApiDisplayTask;