import React from 'react';
import UserStoryBlock from '@/components/UserStoryBlock';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EpicPage = ({ epic, displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const isAccessAllowed = (epicTitle) => {
    if (!isAuthenticated) {
      // Only customer-facing portal authentication is visible when not logged in
      return epicTitle === "Loan Application Portal";
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
    displayMessage('info', 'Login Required', `You need to be logged in to access the "${epic.title}" section.`);
    return (
      <Card className="w-full max-w-lg mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
          <CardDescription>{epic.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-destructive">You must be logged in to view this page.</p>
          <Button onClick={() => navigate('/epics/account-authentication-access')}>Go to Login</Button>
        </CardContent>
      </Card>
    );
  }

  if (isAuthenticated && !isAccessAllowed(epic.title)) {
    displayMessage('destructive', 'Access Denied', `You do not have the required permissions to view "${epic.title}".`);
    return (
      <Card className="w-full max-w-lg mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
          <CardDescription>{epic.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">You do not have the required permissions to view this page (Your role: {user?.role}).</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-primary">{epic.title}</h2>
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