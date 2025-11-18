import React from 'react';
import UserStoryBlock from './UserStoryBlock';

const EpicPage = ({ epic }) => {
  return (
    <div className="epic-page">
      <h2>{epic.title}</h2>
      <p>{epic.description}</p>
      {epic.userStories.map((story) => (
        <UserStoryBlock key={story.id} story={story} />
      ))}
    </div>
  );
};

export default EpicPage;