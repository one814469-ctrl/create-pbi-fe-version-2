import React from 'react';
import LoginForm from '../components/forms/LoginForm';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import epicsData from '../data/epics.json';
import UserStoryBlock from '../components/UserStoryBlock';


const LoginPage = ({ onLogin, isAuthenticated }) => {
  const navigate = useNavigate();

  // Find the relevant Epic and User Story for login
  const loanApplicationPortalEpic = epicsData.find(epic => epic.title === "Loan Application Portal");
  const authStory = loanApplicationPortalEpic?.userStories.find(story => story.title === "Account Authentication & Access");

  if (isAuthenticated) {
    navigate('/'); // Redirect to home if already authenticated
    return null;
  }

  return (
    <div className="login-page">
      <h1>Login to FinTrust Loan Portal</h1>
      <Card>
        {authStory ? (
          <UserStoryBlock story={authStory} onLogin={onLogin} isAuthenticated={isAuthenticated} />
        ) : (
          <LoginForm onLogin={onLogin} isAuthenticated={isAuthenticated} />
        )}
      </Card>
    </div>
  );
};

export default LoginPage;