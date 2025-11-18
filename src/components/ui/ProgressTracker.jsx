import React from 'react';

const ProgressTracker = ({ stages, currentStageIndex }) => {
  return (
    <div className="progress-tracker">
      {stages.map((stage, index) => (
        <div
          key={stage}
          className={`progress-step ${index < currentStageIndex ? 'completed' : ''} ${index === currentStageIndex ? 'current' : ''}`}
        >
          <div className="progress-circle">{index + 1}</div>
          <div className="progress-step-label">{stage}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;