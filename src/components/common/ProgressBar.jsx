import React from 'react';
import '../../styles/ProgressBar.css';

function ProgressBar({ progress, label }) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="progress-bar-container">
      {label && <div className="progress-bar-label">{label}</div>}
      <div className="progress-bar-wrapper">
        <div className="progress-bar-fill" style={{ width: `${clampedProgress}%` }}>
          <span className="progress-bar-text">{clampedProgress}%</span>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;