import React from 'react';
import DynamicFeature from '../DynamicFeature';

const DynamicTaskFeature = ({ task, applicationData, onUpdateApplication, onLogin, isAuthenticated }) => {
  if (!task) return null;

  return (
    <div className="dynamic-task-feature">
      <DynamicFeature
        task={task}
        applicationData={applicationData}
        onUpdateApplication={onUpdateApplication}
        onLogin={onLogin}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default DynamicTaskFeature;