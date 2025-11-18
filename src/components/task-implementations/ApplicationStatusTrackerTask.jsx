import React, { useState, useEffect } from 'react';
import ProgressTracker from '../ui/ProgressTracker';
import Button from '../ui/Button';
import { mockApiCall } from '../../lib/api/mockApi';
import { useToast } from '../ui/Toast';

const ApplicationStatusTrackerTask = ({ task }) => {
  const showToast = useToast();
  const stages = [
    'Submitted',
    'Documents Uploaded',
    'Under Review',
    'Credit Check',
    'Approved/Rejected',
    'Disbursed'
  ];
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedCompletion, setEstimatedCompletion] = useState('24 hours');

  useEffect(() => {
    // Simulate fetching initial status from a backend
    const fetchStatus = async () => {
      setIsLoading(true);
      try {
        const mockStatusData = await mockApiCall({ statusIndex: Math.floor(Math.random() * stages.length) });
        setCurrentStageIndex(mockStatusData.statusIndex);
        setEstimatedCompletion('~' + (24 - mockStatusData.statusIndex * 4) + ' hours remaining');
      } catch (error) {
        showToast('Failed to fetch application status.', 'error');
        console.error('Error fetching status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleUpdateStatus = async (newIndex) => {
    setIsLoading(true);
    try {
      // Simulate API call to update status
      await mockApiCall({ newStatusIndex: newIndex });
      setCurrentStageIndex(newIndex);
      setEstimatedCompletion('~' + (24 - newIndex * 4) + ' hours remaining');
      showToast(`Application status updated to: ${stages[newIndex]}`, 'success');
    } catch (error) {
      showToast('Failed to update application status.', 'error');
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h5>{task.title}</h5>
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-small)', marginBottom: 'var(--spacing-s)' }}>
        Current Application Status: <span className={`status-indicator ${stages[currentStageIndex].toLowerCase().replace(/ /g, '-')}`}>{stages[currentStageIndex]}</span>
      </p>
      <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-muted)' }}>
        Estimated completion: {isLoading ? 'Calculating...' : estimatedCompletion}
      </p>

      <ProgressTracker stages={stages} currentStageIndex={currentStageIndex} />

      <div style={{ marginTop: 'var(--spacing-xl)', display: 'flex', gap: 'var(--spacing-m)', justifyContent: 'center' }}>
        <Button
          onClick={() => handleUpdateStatus(currentStageIndex - 1)}
          disabled={currentStageIndex === 0 || isLoading}
          variant="secondary"
        >
          Previous Stage
        </Button>
        <Button
          onClick={() => handleUpdateStatus(currentStageIndex + 1)}
          disabled={currentStageIndex === stages.length - 1 || isLoading}
          variant="primary"
        >
          Next Stage
        </Button>
      </div>
    </div>
  );
};

export default ApplicationStatusTrackerTask;