import React from 'react';
import UserStoryBlock from '@/components/UserStoryBlock';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EpicPage = ({ epic, displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const isAccessAllowed = (epicTitle) => {
    if (!isAuthenticated) {
      return epicTitle === "Loan Application Portal";
    }
    if (user?.role === 'customer') {
      return ["Loan Application Portal", "Automated Document Verification", "Notifications & Automated Reminders"].includes(epicTitle);
    }
    if (user?.role === 'officer' || user?.role === 'underwriter') {
      return ["Internal Loan Management Dashboard", "Automated Document Verification", "Credit Check & Scoring Integration", "Approval Workflow Automation", "Notifications & Automated Reminders"].includes(epicTitle);
    }
    if (user?.role === 'manager') {
      return ["Internal Loan Management Dashboard", "Reporting & Analytics", "Notifications & Automated Reminders"].includes(epicTitle);
    }
    return false;
  };

  if (!isAuthenticated && epic.title !== "Loan Application Portal") {
    displayMessage('info', 'Login Required', `You need to be logged in to access the "${epic.title}" section.`);
    return (
      <div className="card w-full max-w-lg mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">{epic.title}</p>
        </div>
        <div className="card-content space-y-4">
          <p className="error-text">You must be logged in to view this page.</p>
          <button onClick={() => navigate('/epics/account-authentication-access')}>Go to Login</button>
        </div>
      </div>
    );
  }

  if (isAuthenticated && !isAccessAllowed(epic.title)) {
    displayMessage('error', 'Access Denied', `You do not have the required permissions to view "${epic.title}".`);
    return (
      <div className="card w-full max-w-lg mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">{epic.title}</p>
        </div>
        <div className="card-content">
          <p className="error-text">You do not have the required permissions to view this page (Your role: {user?.role}).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2>{epic.title}</h2>
      <p className="text-muted-foreground">{epic.description}</p>
      <div className="space-y-10">
        {epic.userStories.map((story) => (
          <UserStoryBlock
            key={story.title}
            userStory={story}
            displayMessage={displayMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default EpicPage;