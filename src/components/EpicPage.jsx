import React from 'react';
import UserStoryBlock from './UserStoryBlock';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EpicPage = ({ epic, displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const isAccessAllowed = (epicTitle) => {
    if (!isAuthenticated) {
      return epicTitle === "Loan Application Portal"; // Only customer-facing portal (authentication) is available when not logged in
    }
    // Simple role-based access for demo purposes
    if (user?.role === 'customer') {
      return ["Loan Application Portal", "Automated Document Verification", "Notifications & Automated Reminders"].includes(epicTitle);
    }
    if (user?.role === 'officer' || user?.role === 'underwriter') {
      return ["Internal Loan Management Dashboard", "Automated Document Verification", "Credit Check & Scoring Integration", "Approval Workflow Automation", "Notifications & Automated Reminders"].includes(epicTitle);
    }
    if (user?.role === 'manager') {
      return ["Internal Loan Management Dashboard", "Reporting & Analytics", "Notifications & Automated Reminders"].includes(epicTitle);
    }
    return false; // Default deny
  };

  if (!isAuthenticated && epic.title !== "Loan Application Portal") {
    return (
      <div className="epic-page">
        <h2>{epic.title}</h2>
        <p className="error-message">You need to be logged in to access this section.</p>
        <button onClick={() => navigate('/epics/account-authentication-access')}>Go to Login</button>
      </div>
    );
  }

  if (isAuthenticated && !isAccessAllowed(epic.title)) {
    return (
      <div className="epic-page">
        <h2>{epic.title}</h2>
        <p className="error-message">Access Denied: You do not have the required permissions to view this page ({user?.role} role).</p>
      </div>
    );
  }

  return (
    <div className="epic-page">
      <h2>{epic.title}</h2>
      <p>{epic.description}</p>
      {epic.userStories.map((story) => (
        <UserStoryBlock
          key={story.title}
          userStory={story}
          displayMessage={displayMessage}
        />
      ))}
    </div>
  );
};

export default EpicPage;