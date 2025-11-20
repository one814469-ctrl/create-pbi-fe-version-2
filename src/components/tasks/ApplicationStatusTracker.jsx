import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ApplicationStatusTracker = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { getCustomerApplications } = useLoan();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    displayMessage('error', 'Authentication Required', 'You must be logged in to view application status.');
    return (
      <Card className="w-full max-w-lg mx-auto my-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>View Loan Application Status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Please log in to view your application status.</p>
          <Button onClick={() => navigate('/epics/account-authentication-access')} className="mt-4">Go to Login</Button>
        </CardContent>
      </Card>
    );
  }

  // Use the actual customerID from the logged-in user if available, otherwise a mock for non-customer roles
  const customerApplications = getCustomerApplications(user?.role === 'customer' ? user.customerID : null);

  if (customerApplications.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto my-8">
        <CardHeader>
          <CardTitle>No Loan Applications Found</CardTitle>
          <CardDescription>You haven't submitted any applications yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">It looks like you haven't submitted any loan applications yet.</p>
          <Button onClick={() => navigate('/epics/loan-application-portal')}>Start a New Application</Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusSteps = (status) => {
    const steps = [
      { name: 'Application Submitted', key: 'submitted', order: 1 },
      { name: 'Documents Uploaded', key: 'documents', order: 2 },
      { name: 'Document Review', key: 'doc_review', order: 3 },
      { name: 'Credit Check', key: 'credit_check', order: 4 },
      { name: 'Compliance Check', key: 'compliance', order: 5 },
      { name: 'Decision Made', key: 'decision', order: 6 },
    ];

    let currentStepIndex = 0;
    if (status.includes('Submitted')) currentStepIndex = 0;
    if (status.includes('Documents Uploaded')) currentStepIndex = 1;
    if (status.includes('Document Review') || status.includes('Documents Verified') || status.includes('Manual Document Entry Required')) currentStepIndex = 2;
    if (status.includes('Credit Check') || status.includes('Manual Review Required') || status.includes('Credit Score')) currentStepIndex = 3; // "Credit Score" implies check done
    if (status.includes('Compliance')) currentStepIndex = 4;
    if (status.includes('Approved') || status.includes('Rejected') || status.includes('Manual Review Required (Decision)')) currentStepIndex = 5;

    return steps.map((step, index) => {
      let state = 'pending';
      let isFailed = false;

      if (index < currentStepIndex) {
        state = 'completed';
      } else if (index === currentStepIndex) {
        state = 'current';
      }

      if (status === 'Rejected' && index === 5) { // Only the final decision step can be explicitly failed
        isFailed = true;
        state = 'failed';
      } else if (step.key === 'doc_review' && status === 'Manual Document Entry Required') {
        state = 'current'; // Highlight for action
        isFailed = true;
      } else if (step.key === 'credit_check' && status === 'Manual Review Required' && index === currentStepIndex) {
        state = 'current'; // Highlight for action
        isFailed = true;
      }


      return { ...step, state, isFailed };
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-primary">Your Loan Applications</h3>
      {customerApplications.map((app) => (
        <Card key={app.id} className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">Application ID: {app.id}</CardTitle>
            <Badge
              variant={
                app.status === 'Approved' ? 'default' :
                app.status.includes('Rejected') || app.status.includes('Required') || app.status.includes('Manual') ? 'destructive' :
                'secondary'
              }
            >
              {app.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Type: {app.type}</p>
            <p className="text-muted-foreground mb-4">Amount: ${app.amount.toLocaleString()}</p>

            <div className="space-y-4 pt-4 border-t border-border mt-4">
              {getStatusSteps(app.status).map((step) => (
                <div
                  key={step.key}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-md border",
                    step.state === 'completed' && "bg-green-50/50 border-green-200",
                    step.state === 'current' && "bg-blue-50/50 border-blue-200 font-medium",
                    step.state === 'failed' && "bg-destructive/10 border-destructive/30",
                    step.state === 'pending' && "bg-muted/20"
                  )}
                >
                  {step.state === 'completed' && <span className="text-green-600">✓</span>}
                  {step.state === 'current' && <span className="text-blue-600">●</span>}
                  {step.isFailed && <span className="text-destructive">✕</span>}
                  {step.state === 'pending' && <span className="text-muted-foreground">○</span>}
                  <div>
                    <h6 className="font-semibold">{step.name}</h6>
                    {step.state === 'current' && <p className="text-sm text-blue-800">Your application is currently at this stage.</p>}
                    {step.isFailed && (
                      <p className="text-sm text-destructive">
                        {app.status === 'Rejected' ? `Application ${app.status}. Reason: ${app.creditReport}` :
                         app.status === 'Documents Required' ? 'Action Required: Please upload your documents.' :
                         app.status.includes('Manual') ? 'Action Required: Manual review or correction needed.' : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationStatusTracker;