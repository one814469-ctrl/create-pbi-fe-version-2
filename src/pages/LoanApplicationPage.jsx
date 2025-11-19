import React, { useState } from 'react';
import UserStoryBlock from '../components/UserStoryBlock';

const LoanApplicationPage = ({ epics }) => {
  const loanApplicationEpic = epics.find(epic => epic.title === "Loan Application Portal");
  const submissionStory = loanApplicationEpic?.userStories.find(story => story.title === "Loan Application Submission");

  // Mock application data that can be updated by components
  const [currentApplication, setCurrentApplication] = useState({
    status: 'Draft',
    details: {},
    documents: [],
    ocrData: null,
    creditScore: null,
    decision: null,
    compliance: null,
    history: [{ timestamp: new Date().toISOString(), action: 'Application Drafted' }]
  });

  const handleUpdateApplication = (newData) => {
    setCurrentApplication(prev => ({ ...prev, ...newData }));
    console.log('Application Updated:', { ...currentApplication, ...newData });
  };

  if (!submissionStory) {
    return <div>Loan Application Submission story not found.</div>;
  }

  return (
    <div>
      <h1>New Loan Application</h1>
      <p>Complete the form and upload required documents to submit your loan application.</p>
      <UserStoryBlock
        story={submissionStory}
        applicationData={currentApplication}
        onUpdateApplication={handleUpdateApplication}
      />

      <div className="mt-8 p-4 card">
        <h3>Current Application State (Mock)</h3>
        <pre className="mock-api-response">{JSON.stringify(currentApplication, null, 2)}</pre>
      </div>
    </div>
  );
};

export default LoanApplicationPage;