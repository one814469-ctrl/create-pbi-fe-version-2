import React from 'react';
import { mockReports } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const CSATDashboard = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || user?.role !== 'manager') {
    displayMessage('error', 'Access Denied', 'You need manager permissions to view CSAT metrics.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Customer Satisfaction Tracking</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only managers can view customer satisfaction metrics.</p>
        </div>
      </div>
    );
  }

  const { csatScores } = mockReports;

  if (!csatScores || csatScores.data.length < 2) {
    displayMessage('info', 'Data Warning', 'Insufficient survey data to display meaningful trends.');
    return (
      <div className="card w-full">
        <div className="card-header">
          <h3 className="card-title">Customer Satisfaction Metrics</h3>
          <p className="card-description">Track post-approval customer satisfaction via survey results.</p>
        </div>
        <div className="card-content">
          <p className="text-muted-foreground italic">
            Insufficient survey data to display meaningful trends. Please collect more customer feedback.
          </p>
        </div>
      </div>
    );
  }

  const averageCSAT = csatScores.data.reduce((sum, score) => sum + score, 0) / csatScores.data.length;

  const getCSATBadgeClass = (score) => {
    if (score >= 4) return 'badge-default';
    if (score <= 2) return 'badge-destructive';
    return 'badge-secondary';
  };

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">Customer Satisfaction Metrics</h3>
        <p className="card-description">Track post-approval customer satisfaction via survey results.</p>
      </div>
      <div className="card-content space-y-6">
        <div>
          <h6 className="text-lg font-semibold mb-2">Overall CSAT Score</h6>
          <p className="text-2xl font-bold text-primary">${averageCSAT.toFixed(1)} <span className="text-muted-foreground">/ 5</span></p>
        </div>

        <div>
          <h6 className="text-lg font-semibold mb-2">CSAT Trend (Mock Data)</h6>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {csatScores.labels.map((label, index) => (
              <li key={label}>
                <strong>{label}:</strong> {csatScores.data[index].toFixed(1)} / 5
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h6 className="text-lg font-semibold mb-2">Recent Customer Comments</h6>
          {csatScores.comments.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {csatScores.comments.map(comment => (
                <li key={comment.id}>
                  "{comment.text}" (Score: <span className={`badge ${getCSATBadgeClass(comment.score)}`}>{comment.score}/5</span>)
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-muted-foreground">No recent comments available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSATDashboard;