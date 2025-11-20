import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';

const OCRProcessorMock = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplication } = useLoan();
  const [applicationId, setApplicationId] = useState('');
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualReviewPrompt, setManualReviewPrompt] = useState(false);

  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter')) {
    displayMessage('error', 'Access Denied', 'You need internal permissions to simulate OCR processing.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Automatic Extraction of Data from Documents</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only loan officers and underwriters can trigger OCR processing.</p>
        </div>
      </div>
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
      displayMessage('error', 'OCR Failed', 'Application not found.');
      setLoading(false);
      return;
    }

    if (applicationId === 'NOOCR') {
      displayMessage('error', 'OCR Service Unavailable', 'OCR service is unavailable. Manual data entry and verification triggered.');
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

    const lowConfidence = Math.random() < 0.3;

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

  const getConfidenceBadgeClass = (confidence) => {
    if (confidence === 'Low') return 'badge-destructive';
    return 'badge-secondary';
  };

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">Automatic Extraction of Data from Documents (OCR Mock)</h3>
        <p className="card-description">Extract name, ID, and income details from uploaded documents using OCR.</p>
      </div>
      <div className="card-content space-y-6">
        <form onSubmit={handleProcessOCR} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="ocrAppId" className="block text-sm font-medium">Application ID with uploaded documents</label>
            <input
              id="ocrAppId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g., LA001, LA002, NOOCR (for unavailable mock)"
              disabled={loading}
              className="w-full"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing OCR...' : 'Run OCR on Documents'}
          </button>
        </form>

        {ocrResult && (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">OCR Results for Application {applicationId}:</h6>
            <p>Extracted Name: <strong>{ocrResult.name}</strong></p>
            <p>Extracted ID Number: <strong>{ocrResult.idNumber}</strong></p>
            <p>Extracted Income: <strong>${ocrResult.income.toLocaleString()}</strong></p>
            <p>Confidence: <span className={`badge ${getConfidenceBadgeClass(ocrResult.confidence)}`}>{ocrResult.confidence}</span></p>
          </div>
        )}

        {manualReviewPrompt && (
          <p className="error-text font-medium mt-4">
            <strong>Manual Review Required:</strong> OCR returned low confidence. Please review the extracted fields
            and manually correct them in the application record.
          </p>
        )}
      </div>
    </div>
  );
};

export default OCRProcessorMock;