import React from 'react';
import { mockReports } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const CSATDashboard = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || user?.role !== 'manager') {
    displayMessage('error', 'Access denied. You need manager permissions to view CSAT metrics.');
    return (
      <p className="error-message">
        Access Denied: Only managers can view customer satisfaction metrics.
      </p>
    );
  }

  const { csatScores } = mockReports;

  // Acceptance Criteria: [Negative] Given insufficient survey data
  if (!csatScores || csatScores.data.length < 2) { // Arbitrary low sample size
    return (
      <div className="dashboard-card">
        <h5>Customer Satisfaction Metrics</h5>
        <p className="info-message">
          Insufficient survey data to display meaningful trends. Please collect more customer feedback.
        </p>
      </div>
    );
  }

  const averageCSAT = csatScores.data.reduce((sum, score) => sum + score, 0) / csatScores.data.length;

  // Acceptance Criteria: When I view CSAT dashboard, Then metric trends and recent comments are displayed
  return (
    <div className="dashboard-card">
      <h5>Customer Satisfaction Metrics</h5>
      <p>Overall Average CSAT Score: <strong>{averageCSAT.toFixed(1)} / 5</strong></p>

      <h6>CSAT Trend (Mock Data):</h6>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {csatScores.labels.map((label, index) => (
          <li key={label}>
            <strong>{label}:</strong> {csatScores.data[index].toFixed(1)} / 5
          </li>
        ))}
      </ul>

      <h6 style={{ marginTop: '1.5rem' }}>Recent Customer Comments:</h6>
      {csatScores.comments.length > 0 ? (
        <ul>
          {csatScores.comments.map(comment => (
            <li key={comment.id}>"{comment.text}" (Score: {comment.score}/5)</li>
          ))}
        </ul>
      ) : (
        <p className="info-message">No recent comments available.</p>
      )}
    </div>
  );
};

export default CSATDashboard;