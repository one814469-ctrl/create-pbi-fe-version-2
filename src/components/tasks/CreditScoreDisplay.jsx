import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // For conditional classNames

const CreditScoreDisplay = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications } = useLoan();
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [displayAppData, setDisplayAppData] = useState(null);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'manager' && user?.role !== 'underwriter')) {
    displayMessage('destructive', 'Access Denied', 'You need loan officer/manager/underwriter permissions to view credit scores.');
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
          <CardDescription>Display Credit Score to Loan Officers</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Only loan officers, managers, and underwriters can view credit scores.</p>
        </CardContent>
      </Card>
    );
  }

  // Filter applications that have completed credit checks
  const eligibleApplications = applications.filter(app => app.creditCheckStatus === 'Completed');

  useEffect(() => {
    // If an application is pre-selected or one exists and none is selected, set it.
    if (!selectedApplicationId && eligibleApplications.length > 0) {
      setSelectedApplicationId(eligibleApplications[0].id);
      setDisplayAppData(eligibleApplications[0]);
    } else if (selectedApplicationId) {
      const currentApp = applications.find(a => a.id === selectedApplicationId);
      if (currentApp?.creditCheckStatus === 'Completed') {
        setDisplayAppData(currentApp);
      } else {
        // If selected app no longer has a completed credit check
        setSelectedApplicationId('');
        setDisplayAppData(null);
      }
    }
  }, [applications, selectedApplicationId, eligibleApplications]);

  const handleSelectApplication = (id) => {
    setSelectedApplicationId(id);
    const app = applications.find(a => a.id === id);
    setDisplayAppData(app);
  };

  if (eligibleApplications.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Applicant Credit Score</CardTitle>
          <CardDescription>Show applicant credit score and details in the management dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">No applications with completed credit checks to display yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please use the "Initiate automated credit check" task to process an application first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Applicant Credit Score</CardTitle>
        <CardDescription>Show applicant credit score and details in the management dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="selectApp">Select Application</Label>
          <Select value={selectedApplicationId} onValueChange={handleSelectApplication}>
            <SelectTrigger id="selectApp" className="w-full">
              <SelectValue placeholder="Select an application" />
            </SelectTrigger>
            <SelectContent>
              {eligibleApplications.map(app => (
                <SelectItem key={app.id} value={app.id}>
                  {app.customerName} ({app.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {displayAppData && (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Details for {displayAppData.customerName} (ID: {displayAppData.id})</h6>
            <p>Credit Score: <strong className={cn("text-xl", displayAppData.creditScore < 600 ? "text-destructive" : "text-primary")}>{displayAppData.creditScore}</strong></p>
            <p className="text-muted-foreground">Credit Report Summary: {displayAppData.creditReport}</p>

            {displayAppData.creditScore < 600 && ( // Example threshold
              <Badge variant="destructive" className="mt-2 text-wrap h-auto p-2">
                FLAGGED FOR REJECTION: Credit score {displayAppData.creditScore} is below the minimum threshold (e.g., 600).
                Loan officers should annotate the application with reasons for rejection.
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditScoreDisplay;