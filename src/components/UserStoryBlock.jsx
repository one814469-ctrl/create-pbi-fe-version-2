import React from 'react';

const UserStoryBlock = ({ title, description, children }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="user-story-content">
        {children}
      </div>
    </div>
  );
};

export default UserStoryBlock;