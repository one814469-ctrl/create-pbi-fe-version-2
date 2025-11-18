import React, { useState } from 'react';

const StatusTrackerTask = ({ task }) => {
  const stages = [
    'Submitted',
    'Documents Uploaded',
    'Under Review',
    'Credit Check',
    'Approved/Rejected',
    'Disbursed'
  ];
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const handleNextStage = () => {
    setCurrentStageIndex((prevIndex) => Math.min(prevIndex + 1, stages.length - 1));
  };

  const handlePrevStage = () => {
    setCurrentStageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div>
      <h5>{task.title}</h5>
      <p>Current Application Status: <span className={`status-indicator ${stages[currentStageIndex].toLowerCase().replace(/ /g, '-')}`}>{stages[currentStageIndex]}</span></p>
      <p style={{ fontSize: '0.9em', color: '#ccc' }}>Estimated completion: 24 hours</p>

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

      <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={handlePrevStage} disabled={currentStageIndex === 0}>
          Previous Stage
        </button>
        <button onClick={handleNextStage} disabled={currentStageIndex === stages.length - 1}>
          Next Stage
        </button>
      </div>
    </div>
  );
};

export default StatusTrackerTask;