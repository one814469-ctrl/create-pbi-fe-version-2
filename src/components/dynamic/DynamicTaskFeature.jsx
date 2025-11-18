import React from 'react';
import FormTask from '../task-implementations/FormTask';
import StatusTrackerTask from '../task-implementations/StatusTrackerTask';
import UploadOcrTask from '../task-implementations/UploadOcrTask';
import CreditCheckApiTask from '../task-implementations/CreditCheckApiTask';
import NotificationTask from '../task-implementations/NotificationTask';
import ReportDashboardTask from '../task-implementations/ReportDashboardTask';

const DynamicTaskFeature = ({ task }) => {
  const renderTaskContent = () => {
    switch (task.type) {
      case 'form':
        return <FormTask task={task} />;
      case 'status-tracker':
        return <StatusTrackerTask task={task} />;
      case 'upload-ocr':
        return <UploadOcrTask task={task} />;
      case 'credit-check-api':
        return <CreditCheckApiTask task={task} />;
      case 'notification':
        return <NotificationTask task={task} />;
      case 'report-dashboard':
        return <ReportDashboardTask task={task} />;
      default:
        return <p>No specific implementation for task type: {task.type}</p>;
    }
  };

  return (
    <div className="dynamic-task-feature">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div className="task-content">
        {renderTaskContent()}
      </div>
      <div className="acceptance-criteria">
        <h5>Acceptance Criteria:</h5>
        <ul>
          {task.acceptance_criteria.map((criteria, index) => (
            <li key={index}>{criteria}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DynamicTaskFeature;