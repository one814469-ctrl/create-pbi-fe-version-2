import React from 'react';
import { mockReports } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CSATDashboard = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || user?.role !== 'manager') {
    displayMessage('error', 'Access Denied', 'You need manager permissions to view CSAT metrics.');
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Customer Satisfaction Tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Only managers can view customer satisfaction metrics.</p>
        </CardContent>
      </Card>
    );
  }

  const { csatScores } = mockReports;

  if (!csatScores || csatScores.data.length < 2) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Customer Satisfaction Metrics</CardTitle>
          <CardDescription>Track post-approval customer satisfaction via survey results.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">
            Insufficient survey data to display meaningful trends. Please collect more customer feedback.
          </p>
        </CardContent>
      </Card>
    );
  }

  const averageCSAT = csatScores.data.reduce((sum, score) => sum + score, 0) / csatScores.data.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customer Satisfaction Metrics</CardTitle>
        <CardDescription>Track post-approval customer satisfaction via survey results.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h6 className="text-lg font-semibold mb-2">Overall CSAT Score</h6>
          <p className="text-2xl font-bold text-primary">{averageCSAT.toFixed(1)} / 5</p>
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
                <li key={comment.id}>"{comment.text}" (Score: {comment.score}/5)</li>
              ))}
            </ul>
          ) : (
            <p className="italic">No recent comments available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CSATDashboard;