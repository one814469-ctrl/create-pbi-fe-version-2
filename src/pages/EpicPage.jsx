import React from 'react';
import { useParams } from 'react-router-dom';
import epics from '../data/epics.json';
import { slugify } from '../utils/helpers';
import UserStoryBlock from '../components/dynamic/UserStoryBlock';
import Card from '../components/common/Card';
import '../styles/EpicPage.css';

function EpicPage() {
  const { epicSlug } = useParams();
  const epic = epics.find(e => slugify(e.title) === epicSlug);

  if (!epic) {
    return (
      <Card title="Epic Not Found">
        <p>The epic you are looking for does not exist.</p>
      </Card>
    );
  }

  return (
    <div className="epic-page">
      <h1 className="epic-title">{epic.title}</h1>
      <p className="epic-description">{epic.description}</p>
      <div className="user-stories-container">
        {epic.userStories && epic.userStories.map((story, index) => (
          <UserStoryBlock key={index} userStory={story} />
        ))}
      </div>
    </div>
  );
}

export default EpicPage;