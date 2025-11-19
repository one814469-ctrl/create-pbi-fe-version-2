import React from 'react';
import DynamicUserStoryFeature from './dynamic/DynamicUserStoryFeature';
import NotFoundPage from '../pages/NotFoundPage';

const EpicPage = ({ epic, applicationData, onUpdateApplication, onLogin, isAuthenticated }) => {
  if (!epic) {
    return <NotFoundPage />;
  }

  return (
    <div className="container">
      <h1>{epic.title}</h1>
      <p>{epic.description}</p>
      {epic.userStories.map((story, index) => (
        <DynamicUserStoryFeature
          key={index}
          story={story}
          applicationData={applicationData}
          onUpdateApplication={onUpdateApplication}
          onLogin={onLogin}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
};

export default EpicPage;