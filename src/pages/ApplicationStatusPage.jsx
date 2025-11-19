import React from 'react';
import UserStoryBlock from '../components/UserStoryBlock';
import ApplicationStatusTracker from '../components/status/ApplicationStatusTracker';

const ApplicationStatusPage = ({ epics }) => {
  const applicationPortalEpic = epics.find(epic => epic.title === "Loan Application Portal");
  const statusTrackingStory = applicationPortalEpic?.userStories.find(story => story.title === "Application Status Tracking");

  // Mock application data for demonstration
  // This would typically come from a global state or API call
  const mockApplicationData = {
    id: 'APP-001-2023',
    status: 'In Review',
    applicantName: 'John Doe',
    submissionDate: '2023-10-25',
    details: { loanAmount: 25000, income: 60000 },
    documents: [{ name: 'ID_JohnDoe.pdf' }, { name: 'Paystub_JohnDoe.pdf' }],
    docVerificationStatus: 'Pending', // e.g., 'Verified', 'Failed', 'Pending'
    creditScore: null,
    compliance: null,
    decision: null,
    history: [
      { timestamp: '2023-10-25T10:00:00Z', action: 'Application Submitted' },
      { timestamp: '2023-10-25T11:30:00Z', action: 'Documents Uploaded' },
      { timestamp: '2023-10-26T09:00:00Z', action: 'Application moved to "In Review"' },
    ],
  };

  const emptyApplicationData = { status: 'empty' }; // For empty state

  // You can toggle this to test the empty state
  const hasActiveApplication = true; // Set to false to see empty state

  return (
    <div>
      <h1>Application Status</h1>
      <p>View the real-time status and history of your loan applications.</p>

      {statusTrackingStory ? (
        <UserStoryBlock
          story={statusTrackingStory}
          applicationData={hasActiveApplication ? mockApplicationData : emptyApplicationData}
        />
      ) : (
        <p>Application Status Tracking story not found.</p>
      )}
    </div>
  );
};

export default ApplicationStatusPage;