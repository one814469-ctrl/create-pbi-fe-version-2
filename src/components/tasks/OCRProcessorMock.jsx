import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const OCRProcessorMock = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplication } = useLoan();
  const [applicationId, setApplicationId] = useState('');
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualReviewPrompt, setManualReviewPrompt] = useState(false);

  // Guardrail: OCR is a system task, but simulating it might be for internal users
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter')) {
    displayMessage('error', 'Access Denied', 'You need internal permissions to simulate OCR processing.');
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Automatic Extraction of Data from Documents</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Only loan officers and underwriters can trigger OCR processing.</p>
        </CardContent>
      </Card>
    );
  }

  const handleProcessOCR = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      displayMessage('error', 'Validation Error', 'Please enter an Application ID.');
      return;
    }

    setLoading(true);
    setOcrResult(null);
    setManualReviewPrompt(false);

    const app = applications.find(a => a.id === applicationId);
    if (!app) {
      displayMessage('destructive', 'OCR Failed', 'Application not found.');
      setLoading(false);
      return;
    }

    if (applicationId === 'NOOCR') { // Mock for OCR service unavailable
      displayMessage('destructive', 'OCR Service Unavailable', 'OCR service is unavailable. Manual data entry and verification triggered.');
      setLoading(false);
      updateApplication(applicationId, { status: 'Manual Document Entry Required', documentVerificationStatus: 'Manual' });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const extractedData = {
      name: `Applicant ${applicationId}`,
      idNumber: `ID-${Math.floor(Math.random() * 90000) + 10000}`,
      income: Math.floor(Math.random() * (150000 - 30000 + 1)) + 30000,
    };

    const lowConfidence = Math.random() < 0.3; // 30% chance of low confidence

    setOcrResult({
      ...extractedData,
      confidence: lowConfidence ? 'Low' : 'High',
    });

    if (lowConfidence) {
      setManualReviewPrompt(true);
      displayMessage('info', 'OCR with Low Confidence', 'OCR completed with low confidence. Manual review/correction required.');
      updateApplication(applicationId, {
        ocrExtractedData: extractedData,
        documentVerificationStatus: 'Manual Review Required',
        status: 'Manual Document Review Required',
        auditTrail: [
          ...(app?.auditTrail || []),
          { timestamp: new Date().toISOString(), user: 'OCR System', action: `OCR processed, low confidence. Manual review flagged.` }
        ]
      });
    } else {
      displayMessage('success', 'OCR Successful', 'OCR processing completed successfully. Data extracted.');
      updateApplication(applicationId, {
        ocrExtractedData: extractedData,
        documentVerificationStatus: 'Verified',
        status: 'Documents Verified',
        auditTrail: [
          ...(app?.auditTrail || []),
          { timestamp: new Date().toISOString(), user: 'OCR System', action: `OCR processed, data extracted.` }
        ]
      });
    }
    setLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Automatic Extraction of Data from Documents (OCR Mock)</CardTitle>
        <CardDescription>Extract name, ID, and income details from uploaded documents using OCR.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleProcessOCR} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ocrAppId">Application ID with uploaded documents</Label>
            <Input
              id="ocrAppId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g., LA001, LA002, NOOCR (for unavailable mock)"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing OCR...' : 'Run OCR on Documents'}
          </Button>
        </form>

        {ocrResult && (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">OCR Results for Application {applicationId}:</h6>
            <p>Extracted Name: <strong>{ocrResult.name}</strong></p>
            <p>Extracted ID Number: <strong>{ocrResult.idNumber}</strong></p>
            <p>Extracted Income: <strong>${ocrResult.income.toLocaleString()}</strong></p>
            <p>Confidence: <Badge variant={ocrResult.confidence === 'Low' ? 'destructive' : 'secondary'}>{ocrResult.confidence}</Badge></p>
          </div>
        )}

        {manualReviewPrompt && (
          <p className="text-destructive font-medium mt-4">
            <strong>Manual Review Required:</strong> OCR returned low confidence. Please review the extracted fields
            and manually correct them in the application record.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OCRProcessorMock;