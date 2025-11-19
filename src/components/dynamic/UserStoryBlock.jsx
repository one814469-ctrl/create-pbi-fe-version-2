import React from 'react';
import DynamicTaskFeature from './DynamicTaskFeature';
import Card from '../common/Card';

function UserStoryBlock({ userStory }) {
  return (
    <Card className="user-story-block">
      <h3>{userStory.title}</h3>
      <p>{userStory.description}</p>
      {userStory.tasks && userStory.tasks.map((task, taskIndex) => (
        <DynamicTaskFeature key={taskIndex} task={task} />
      ))}
    </Card>
  );
}

export default UserStoryBlock;