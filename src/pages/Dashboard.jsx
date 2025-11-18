import React from 'react';
import { Link } from 'react-router-dom';
import epicsData from '../data/epics.json';
import { appRoutes } from '../router';

const Dashboard = () => {
  // Simple aggregation of mock data for a dashboard overview
  const totalEpics = epicsData.length;
  const totalUserStories = epicsData.reduce((sum, epic) => sum + epic.userStories.length, 0);
  const totalTasks = epicsData.reduce((sum, epic) => sum + epic.userStories.reduce((sSum, story) => sSum + story.tasks.length, 0), 0);

  return (
    <div className="dashboard-page">
      <div className="welcome-message">
        <h2>Welcome to the SLPS Admin Dashboard!</h2>
        <p style={{ color: 'var(--color-muted)' }}>
          This dashboard provides a high-level overview of the Smart Loan Processing System's capabilities.
          Navigate through the Epics in the side menu to explore specific features.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-l)', marginTop: 'var(--spacing-xl)' }}>
        <div className="chart-card">
          <h5>System Overview</h5>
          <p><strong>Total Epics:</strong> {totalEpics}</p>
          <p><strong>Total User Stories:</strong> {totalUserStories}</p>
          <p><strong>Total Tasks Implemented:</strong> {totalTasks}</p>
          <p style={{fontSize: 'var(--font-size-small)', color: 'var(--color-muted)', marginTop: 'var(--spacing-s)'}}>
            <em>(These numbers dynamically reflect the `epics.json` content.)</em>
          </p>
        </div>

        <div className="chart-card">
          <h5>Quick Access</h5>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-s)' }}>
            {appRoutes.map(route => (
              <li key={route.path}>
                <Link to={route.path} className="button button-accent" style={{width: '100%'}}>
                  Go to {route.epic.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;