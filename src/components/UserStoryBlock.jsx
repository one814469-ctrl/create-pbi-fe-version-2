import React from 'react';
import DynamicTaskFeature from './DynamicTaskFeature';

const UserStoryBlock = ({ userStory, displayMessage }) => {
  return (
    <div className="user-story-block">
      <h3>{userStory.title}</h3>
      <p>{userStory.description}</p>
      {userStory.tasks.map((task) => (
        <div key={task.title} className="task-feature">
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <DynamicTaskFeature task={task} displayMessage={displayMessage} />
        </div>
      ))}
    </div>
  );
};

export default UserStoryBlock;