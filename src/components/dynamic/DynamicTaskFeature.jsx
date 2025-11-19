import React from 'react';
import DynamicFeature from '../DynamicFeature';

/**
 * DynamicTaskFeature
 * Renders a single task's interactive feature by delegating to DynamicFeature
 * This is a thin wrapper to align with the requested file structure.
 */
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