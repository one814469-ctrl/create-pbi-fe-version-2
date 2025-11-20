import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ComplianceValidator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const [applicationId, setApplicationId] = useState('');
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter' && user?.role !== 'manager')) {
    displayMessage('error', 'Access Denied', 'You need appropriate permissions to simulate compliance checks.');
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Automated Compliance Validation</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Only loan officers, underwriters, and managers can trigger compliance validation.</p>
        </CardContent>
      </Card>
    );
  }

  const handleValidateCompliance = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      displayMessage('error', 'Validation Error', 'Please enter an Application ID.');
      return;
    }

    setLoading(true);
    setComplianceStatus(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isCompliant = applicationId === 'LA002' || Math.random() > 0.3; // LA002 is always compliant
    setComplianceStatus({
      id: applicationId,
      compliant: isCompliant,
      reason: isCompliant ? 'All regulatory rules met for approval.' : 'Potential issue: KYC document expiry detected. Manual review required.',
    });

    if (isCompliant) {
      displayMessage('success', 'Compliance Check', `Application ${applicationId} is compliant. Approval can proceed.`);
    } else {
      displayMessage('destructive', 'Compliance Check', `Application ${applicationId} failed compliance check. Manual review needed.`);
    }
    setLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Automated Compliance Validation</CardTitle>
        <CardDescription>Check loan applications against regulatory rules for compliance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleValidateCompliance} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="complianceAppId">Application ID</Label>
            <Input
              id="complianceAppId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g., LA001, LA002"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Validating...' : 'Run Compliance Check'}
          </Button>
        </form>

        {complianceStatus && (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Result for Application {complianceStatus.id}:</h6>
            <Badge variant={complianceStatus.compliant ? 'default' : 'destructive'}>
              Status: {complianceStatus.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
            </Badge>
            <p className="text-muted-foreground">{complianceStatus.reason}</p>
            <p className="text-sm text-muted-foreground italic">
              (Mocked: Imagine updated rules would apply to new checks automatically.)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceValidator;