import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import OcrExtractionMock from '../components/mocks/OcrExtractionMock';
import CreditCheckMock from '../components/mocks/CreditCheckMock';
import DecisionEngineMock from '../components/mocks/DecisionEngineMock';
import ComplianceMock from '../components/mocks/ComplianceMock';
import NotificationSimulator from '../components/mocks/NotificationSimulator';

const InternalDashboardPage = ({ epics }) => {
  const internalDashboardEpic = epics.find(epic => epic.title === "Internal Loan Management Dashboard");
  const automatedDocVerificationEpic = epics.find(epic => epic.title === "Automated Document Verification");
  const creditCheckEpic = epics.find(epic => epic.title === "Credit Check & Scoring Integration");
  const approvalWorkflowEpic = epics.find(epic => epic.title === "Approval Workflow Automation");
  const notificationsEpic = epics.find(epic => epic.title === "Notifications & Automated Reminders");

  const searchAndFilterStory = internalDashboardEpic?.userStories.find(story => story.title === "Loan Application Search & Filters");
  const auditTrailStory = internalDashboardEpic?.userStories.find(story => story.title === "Application Audit Trail");
  const displayCreditScoreStory = creditCheckEpic?.userStories.find(story => story.title === "Display Credit Score to Loan Officers");
  const internalTaskRemindersStory = notificationsEpic?.userStories.find(story => story.title === "Internal Task Reminders");

  const [mockApplications, setMockApplications] = useState([
    {
      id: 'APP-001', customerName: 'Alice Smith', customerId: 'CS001', status: 'Pending Doc Verification',
      loanAmount: 50000, creditScore: null, decision: null, docVerificationStatus: 'Pending', compliance: 'Pending',
      history: [{ timestamp: '2023-10-20T09:00:00Z', action: 'Application Submitted' }],
      documents: [{ name: 'ID_Alice.pdf' }], ocrData: null
    },
    {
      id: 'APP-002', customerName: 'Bob Johnson', customerId: 'CS002', status: 'Credit Check Required',
      loanAmount: 25000, creditScore: 720, decision: null, docVerificationStatus: 'Verified', compliance: 'Pending',
      history: [
        { timestamp: '2023-10-21T10:00:00Z', action: 'Application Submitted' },
        { timestamp: '2023-10-21T11:00:00Z', action: 'Documents Uploaded' },
        { timestamp: '2023-10-22T08:30:00Z', action: 'Document Verification: Verified' }
      ],
      documents: [{ name: 'ID_Bob.pdf' }, { name: 'Paystub_Bob.pdf' }], ocrData: {name: 'Bob Johnson', idNumber: '987-65-432', incomeDetails: '$4,500/month', confidence: 'High'}
    },
    {
      id: 'APP-003', customerName: 'Charlie Brown', customerId: 'CB003', status: 'Approved',
      loanAmount: 10000, creditScore: 680, decision: 'Approved', docVerificationStatus: 'Verified', compliance: 'Compliant',
      history: [
        { timestamp: '2023-10-18T14:00:00Z', action: 'Application Submitted' },
        { timestamp: '2023-10-18T15:00:00Z', action: 'Documents Uploaded' },
        { timestamp: '2023-10-19T09:00:00Z', action: 'Document Verification: Verified' },
        { timestamp: '2023-10-19T10:00:00Z', action: 'Credit Check Initiated' },
        { timestamp: '2023-10-19T10:05:00Z', action: 'Automated Decision: Approved' }
      ],
      documents: [{ name: 'ID_Charlie.pdf' }], ocrData: {name: 'Charlie Brown', idNumber: '111-22-333', incomeDetails: '$3,000/month', confidence: 'High'}
    },
    {
      id: 'APP-INTERNAL-REMINDERS',
      internalReminders: []
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleUpdateApplication = (appId, newValues) => {
    setMockApplications(prevApps => prevApps.map(app =>
      app.id === appId ? { ...app, ...newValues } : app
    ));
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication(prev => ({ ...prev, ...newValues }));
    }
  };

  const filteredApplications = mockApplications.filter(app =>
    app.id !== 'APP-INTERNAL-REMINDERS' &&
    (app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCreditScoreTask = displayCreditScoreStory?.tasks[0];
  const getAuditTrailTask = auditTrailStory?.tasks[0];
  const getSearchTask = searchAndFilterStory?.tasks[0];
  const getInternalReminderTask = internalTaskRemindersStory?.tasks[0];

  return (
    <div>
      <h1>Internal Loan Management Dashboard</h1>
      <p>{internalDashboardEpic?.description}</p>

      <div className="dashboard-grid">
        <Card>
          <h3>Loan Applications Overview</h3>
          {getSearchTask && (
            <div className="search-bar">
              <Input
                type="text"
                placeholder="Search by name, ID, or App ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={() => alert(`Searching for: ${searchTerm}`)}>Search</Button>
            </div>
          )}
          {searchTerm && filteredApplications.length === 0 && (
            <p className="error-message">No applications found for "{searchTerm}".
              <em> (Edge Case: {getSearchTask?.acceptance_criteria[1]} Mocked)</em>
            </p>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>App ID</th>
                  <th>Customer Name</th>
                  <th>Status</th>
                  <th>Loan Amount</th>
                  <th>Credit Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(app => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.customerName}</td>
                    <td>{app.status}</td>
                    <td>${app.loanAmount}</td>
                    <td>{app.creditScore || 'N/A'}</td>
                    <td>
                      <Button onClick={() => setSelectedApplication(app)} className="button-secondary">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4">
              <em>Acceptance Criteria (Positive): {getSearchTask?.acceptance_criteria[0]} (Mocked: Matching applications listed)</em>
            </p>
          </div>
        </Card>

        {selectedApplication && (
          <Card>
            <h3>Application Details: {selectedApplication.id}</h3>
            <h4>Customer: {selectedApplication.customerName}</h4>
            <p><strong>Status:</strong> {selectedApplication.status}</p>
            <p><strong>Loan Amount:</strong> ${selectedApplication.loanAmount}</p>

            {getCreditScoreTask && (
              <div className="mt-4 p-4 border-dashed">
                <h4>{getCreditScoreTask.title}</h4>
                <p>{getCreditScoreTask.description}</p>
                {selectedApplication.creditScore ? (
                  <div className="mock-api-response success">
                    <p><strong>Credit Score:</strong> {selectedApplication.creditScore}</p>
                    <p><strong>Summary Report:</strong> Excellent payment history, moderate debt utilization.</p>
                    {selectedApplication.creditScore < 600 && (
                      <p className="error-message">
                        <em>Acceptance Criteria (Edge): {getCreditScoreTask.acceptance_criteria[1]} (Mocked: Application flagged for rejection)</em>
                      </p>
                    )}
                    <p className="success-message mt-2">
                      <em>Acceptance Criteria (Positive): {getCreditScoreTask.acceptance_criteria[0]} (Mocked: Credit score and summary displayed)</em>
                    </p>
                  </div>
                ) : (
                  <p>Credit check not yet performed or score not available.</p>
                )}
              </div>
            )}

            {automatedDocVerificationEpic?.userStories.map(story => (
              story.title === "OCR Document Processing" && story.tasks[0] ? (
              <div key={story.title} className="mt-4 p-4 border-dashed">
                <h4>{story.tasks[0].title}</h4>
                <OcrExtractionMock onUpdateApplication={(val) => handleUpdateApplication(selectedApplication.id, val)} task={story.tasks[0]} />
                {selectedApplication.ocrData && selectedApplication.ocrData.status === 'success' && (
                  <div className="mock-api-response mt-2 success">
                    <h5>Current OCR Data for {selectedApplication.id}:</h5>
                    <p>Name: {selectedApplication.ocrData.name}</p>
                    <p>ID: {selectedApplication.ocrData.idNumber}</p>
                    <p>Income: {selectedApplication.ocrData.incomeDetails}</p>
                    <p>Confidence: {selectedApplication.ocrData.confidence}</p>
                  </div>
                )}
                {selectedApplication.ocrData && selectedApplication.ocrData.status === 'error' && (
                   <div className="mock-api-response mt-2 error">
                     <p>{selectedApplication.ocrData.message}</p>
                   </div>
                )}
              </div>
              ) : null
            ))}

            {creditCheckEpic?.userStories.map(story => (
              story.title === "Credit Bureau API Integration" && story.tasks[0] ? (
              <div key={story.title} className="mt-4 p-4 border-dashed">
                <h4>{story.tasks[0].title}</h4>
                <CreditCheckMock onUpdateApplication={(val) => handleUpdateApplication(selectedApplication.id, val)} task={story.tasks[0]} />
              </div>
              ) : null
            ))}

            {approvalWorkflowEpic?.userStories.map(story => (
              story.title === "Automated Decision Engine" && story.tasks[0] ? (
              <div key={story.title} className="mt-4 p-4 border-dashed">
                <h4>{story.tasks[0].title}</h4>
                <DecisionEngineMock onUpdateApplication={(val) => handleUpdateApplication(selectedApplication.id, val)} task={story.tasks[0]} />
              </div>
              ) : null
            ))}
            {approvalWorkflowEpic?.userStories.map(story => (
              story.title === "Compliance Check Integration" && story.tasks[0] ? (
              <div key={story.title} className="mt-4 p-4 border-dashed">
                <h4>{story.tasks[0].title}</h4>
                <ComplianceMock onUpdateApplication={(val) => handleUpdateApplication(selectedApplication.id, val)} task={story.tasks[0]} />
              </div>
              ) : null
            ))}

            {getAuditTrailTask && (
              <div className="mt-4 p-4 border-dashed">
                <h4>{getAuditTrailTask.title}</h4>
                <p>{getAuditTrailTask.description}</p>
                <div className="mock-api-response">
                  <h5>Audit Log for {selectedApplication.id}:</h5>
                  {selectedApplication.history && selectedApplication.history.length > 0 ? (
                    <ul>
                      {selectedApplication.history.map((entry, index) => (
                        <li key={index}>
                          <strong>{new Date(entry.timestamp).toLocaleString()}:</strong> {entry.action}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No audit trail entries for this application.</p>
                  )}
                  <p className="mt-2">
                    <em>Acceptance Criteria (Positive): {getAuditTrailTask.acceptance_criteria[0]} (Mocked: All actions, timestamps, and user details displayed)</em>
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}

        {getInternalReminderTask && (
          <Card>
            <h3>Internal Task Reminders</h3>
            <NotificationSimulator
              notificationType="internal_reminder"
              onUpdateApplication={(val) => handleUpdateApplication('APP-INTERNAL-REMINDERS', val)}
              task={getInternalReminderTask}
            />
            {mockApplications.find(app => app.id === 'APP-INTERNAL-REMINDERS')?.internalReminders && (
              <div className="mock-api-response mt-2">
                <h5>Recent Reminders:</h5>
                <ul className="notification-list">
                  {mockApplications.find(app => app.id === 'APP-INTERNAL-REMINDERS').internalReminders.map((rem, idx) => (
                    <li key={idx} className="info">
                      <span>{rem.message}</span>
                      <small>{new Date(rem.timestamp).toLocaleTimeString()}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default InternalDashboardPage;