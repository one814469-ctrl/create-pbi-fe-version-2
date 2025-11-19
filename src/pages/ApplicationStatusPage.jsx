import React, { useState, useEffect } from 'react';
import UserStoryBlock from '../components/UserStoryBlock';

const ApplicationStatusPage = ({ epics }) => {
  const applicationPortalEpic = epics.find(epic => epic.title === "Loan Application Portal");
  const statusTrackingStory = applicationPortalEpic?.userStories.find(story => story.title === "Application Status Tracking");

  const [currentApplication, setCurrentApplication] = useState(null);

  useEffect(() => {
    const mockApplicationData = {
      id: 'APP-001-2023',
      status: 'In Review',
      applicantName: 'John Doe',
      submissionDate: '2023-10-25',
      details: { loanAmount: 25000, income: 60000 },
      documents: [{ name: 'ID_JohnDoe.pdf' }, { name: 'Paystub_JohnDoe.pdf' }],
      docVerificationStatus: 'Pending',
      creditScore: null,
      compliance: null,
      decision: null,
      history: [
        { timestamp: '2023-10-25T10:00:00Z', action: 'Application Submitted' },
        { timestamp: '2023-10-25T11:30:00Z', action: 'Documents Uploaded' },
        { timestamp: '2023-10-26T09:00:00Z', action: 'Application moved to "In Review"' },
      ],
    };

    const hasActiveApplication = true;
    setCurrentApplication(hasActiveApplication ? mockApplicationData : { status: 'empty' });
  }, []);

  return (
    <div>
      <h1>Application Status</h1>
      <p>View the real-time status and history of your loan applications.</p>

      {statusTrackingStory ? (
        <UserStoryBlock
          story={statusTrackingStory}
          applicationData={currentApplication}
        />
      ) : (
        <p>Application Status Tracking story not found.</p>
      )}
    </div>
  );
};

export default ApplicationStatusPage;