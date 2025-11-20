import React from 'react';
import DynamicTaskFeature from '@/components/DynamicTaskFeature';

const UserStoryBlock = ({ userStory, displayMessage }) => {
  return (
    <div className="card border-l-4 border-primary">
      <div className="card-header">
        <h3 className="card-title">{userStory.title}</h3>
        <p className="card-description">{userStory.description}</p>
      </div>
      <div className="card-content space-y-6">
        {userStory.tasks.map((task) => (
          <div key={task.title} className="pt-4 border-t border-border-default first:border-t-0 first:pt-0">
            <h4 className="text-lg font-semibold text-primary">{task.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
            <DynamicTaskFeature task={task} displayMessage={displayMessage} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStoryBlock;