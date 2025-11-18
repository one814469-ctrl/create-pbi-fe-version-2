import React from 'react';
import DynamicTaskFeature from './dynamic/DynamicTaskFeature';

const UserStoryBlock = ({ story }) => {
  return (
    <div className="user-story-block">
      <h3>{story.title}</h3>
      <p>{story.description}</p>
      <div className="tasks-container">
        {story.tasks.map((task) => (
          <DynamicTaskFeature key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default UserStoryBlock;