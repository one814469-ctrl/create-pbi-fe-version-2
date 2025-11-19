import React from 'react';
import UserStoryBlock from '../UserStoryBlock';

/**
 * DynamicUserStoryFeature
 * Renders a single user story's block dynamically.
 * This component is intended to be used by EpicPage or Epic route to render each story.
 */
const DynamicUserStoryFeature = ({ story, applicationData, onUpdateApplication, onLogin, isAuthenticated }) => {
  if (!story) return null;

  return (
    <div className="dynamic-user-story-feature">
      <UserStoryBlock
        story={story}
        applicationData={applicationData}
        onUpdateApplication={onUpdateApplication}
        onLogin={onLogin}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default DynamicUserStoryFeature;