import React, { useState, useEffect } from 'react';
import UserStoryBlock from '../components/UserStoryBlock';
import { useNavigate } from 'react-router-dom';

const ApplicationStatusPage = ({ epics }) => {
  const navigate = useNavigate();

  const applicationPortalEpic = epics.find(epic => epic.title === "Loan Application Portal");
  const statusTrackingStory = applicationPortalEpic?.userStories.find(story => story.title === "Application Status Tracking");

  // This state will represent a single, active application for the logged-in user
  // In a real app, this would come from a global state, context, or API call
  const [currentApplication, setCurrentApplication] = useState(null);

  // Simulate loading application data on mount
  useEffect(() => {
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

    // Simulate having an active application (set to null to test empty state)
    const hasActiveApplication = true; 
    setCurrentApplication(hasActiveApplication ? mockApplicationData : { status: 'empty' });
  }, []);

  // Negative case: Given I access the status page without authentication
  // Handled by App.jsx router redirecting to /login if not authenticated

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