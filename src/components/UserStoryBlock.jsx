import React from 'react';
import Card from './ui/Card';
import DynamicFeature from './DynamicFeature';

const UserStoryBlock = ({ story, applicationData, onUpdateApplication }) => {
  return (
    <Card>
      <h3>{story.title}</h3>
      <p>{story.description}</p>
      <div className="user-story-tasks">
        {story.tasks.map((task, index) => (
          <div key={index} className="task-item mt-4 p-4 border-dashed">
            <h4>Task: {task.title}</h4>
            <p>{task.description}</p>
            <DynamicFeature 
              task={task} 
              applicationData={applicationData} 
              onUpdateApplication={onUpdateApplication} 
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UserStoryBlock;