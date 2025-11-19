import React from 'react';
import UserStoryBlock from './UserStoryBlock';

// This component is generic and could be used if all epics had a dedicated page.
// In this project, specific pages like LoanApplicationPage, InternalDashboardPage
// are used for better control, but this demonstrates the dynamic rendering.
const EpicPage = ({ epic }) => {
  if (!epic) {
    return <div className="container"><h1>Epic Not Found</h1></div>;
  }

  return (
    <div className="container">
      <h1>{epic.title}</h1>
      <p>{epic.description}</p>
      {epic.userStories.map((story, index) => (
        <UserStoryBlock key={index} story={story} />
      ))}
    </div>
  );
};

export default EpicPage;