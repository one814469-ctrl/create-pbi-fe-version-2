import React from 'react';
import UserStoryBlock from '../UserStoryBlock';

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