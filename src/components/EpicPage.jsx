import React from 'react';
import DynamicUserStoryFeature from './dynamic/DynamicUserStoryFeature';
import NotFoundPage from '../pages/NotFoundPage'; // Import NotFoundPage for better error handling

/**
 * EpicPage
 * Renders a generic page for an Epic, displaying its description and all associated User Stories
 * with their tasks as interactive features.
 * This component is used by the generic /epic/:slug route.
 */
const EpicPage = ({ epic, applicationData, onUpdateApplication, onLogin, isAuthenticated }) => {
  if (!epic) {
    return <NotFoundPage />; // If epic data is not found, render the Not Found page
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