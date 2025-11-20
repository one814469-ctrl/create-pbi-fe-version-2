import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CreditCheckInitiator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplication } = useLoan();
  const [applicationId, setApplicationId] = useState('');
  const [creditCheckResult, setCreditCheckResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter')) {
    displayMessage('error', 'Access Denied', 'You need loan officer/underwriter permissions to initiate credit checks.');
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Initiate Automated Credit Check</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Only loan officers and underwriters can initiate credit checks.</p>
        </CardContent>
      </Card>
    );
  }

  const handleInitiateCreditCheck = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      displayMessage('error', 'Validation Error', 'Please enter an Application ID.');
      return;
    }

    setLoading(true);
    setCreditCheckResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (applicationId === 'INVALID') {
      setCreditCheckResult({ error: 'Validation Error: Invalid applicant data provided.' });
      displayMessage('destructive', 'Credit Check Failed', 'Invalid data provided for credit check.');
      setLoading(false);
      return;
    }

    if (applicationId === 'TIMEOUT') {
      setCreditCheckResult({ error: 'API Timeout: Credit Bureau service unavailable.' });
      displayMessage('destructive', 'Credit Check Failed', 'Credit Bureau API timed out. Manual review workflow initiated.');
      setLoading(false);
      updateApplication(applicationId, { creditCheckStatus: 'Manual Review Required' });
      return;
    }

    const mockScore = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
    const mockReport = mockScore > 700 ? 'Excellent credit history.' : (mockScore > 600 ? 'Good credit history.' : 'Fair to poor credit history.');

    setCreditCheckResult({ score: mockScore, report: mockReport });
    displayMessage('success', 'Credit Check Completed', `Credit check completed for ${applicationId}. Score: ${mockScore}`);
    
    // Find the application and update its audit trail
    const currentApp = applications.find(app => app.id === applicationId);
    updateApplication(applicationId, {
      creditScore: mockScore,
      creditReport: mockReport,
      creditCheckStatus: 'Completed',
      status: `Credit Score: ${mockScore}`, // Update main status
      auditTrail: [
        ...(currentApp?.auditTrail || []),
        { timestamp: new Date().toISOString(), user: user.username, action: `Credit Check Initiated. Score: ${mockScore}` }
      ]
    });
    setLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Initiate Automated Credit Check</CardTitle>
        <CardDescription>Initiate a credit check for applications to assess loan eligibility quickly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleInitiateCreditCheck} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="creditAppId">Application ID</Label>
            <Input
              id="creditAppId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g., LA001, LA002, INVALID, TIMEOUT"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Initiate Credit Check'}
          </Button>
        </form>

        {creditCheckResult && (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Credit Check Result:</h6>
            {creditCheckResult.error ? (
              <p className="text-destructive">Error: {creditCheckResult.error}</p>
            ) : (
              <>
                <p>Credit Score: <strong>{creditCheckResult.score}</strong></p>
                <p className="text-muted-foreground">Report Summary: {creditCheckResult.report}</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditCheckInitiator;