import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';

const OCRProcessorMock = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplication } = useLoan();
  const [applicationId, setApplicationId] = useState('');
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualReviewPrompt, setManualReviewPrompt] = useState(false);

  // Guardrail: OCR is a system task, but simulating it might be for internal users
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter')) {
    displayMessage('error', 'Access denied. You need internal permissions to simulate OCR processing.');
    return (
      <p className="error-message">
        Access Denied: Only loan officers and underwriters can trigger OCR processing.
      </p>
    );
  }

  const handleProcessOCR = async (e) => {
    e.preventDefault();
    if (!applicationId) {
      displayMessage('error', 'Please enter an Application ID.');
      return;
    }

    setLoading(true);
    setOcrResult(null);
    setManualReviewPrompt(false);

    const app = applications.find(a => a.id === applicationId);

    // Acceptance Criteria: [Negative] Given OCR service is unavailable
    if (applicationId === 'NOOCR') {
      displayMessage('error', 'OCR service is unavailable. Manual data entry and verification triggered.');
      setLoading(false);
      updateApplication(applicationId, { status: 'Manual Document Entry Required', documentVerificationStatus: 'Manual' });
      return;
    }

    // Simulate OCR processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock OCR outcome
    const extractedData = {
      name: `Applicant ${applicationId}`,
      idNumber: `ID-${Math.floor(Math.random() * 90000) + 10000}`,
      income: Math.floor(Math.random() * (150000 - 30000 + 1)) + 30000,
    };

    // Acceptance Criteria: [Edge] Given OCR returns low confidence on extracted data
    const lowConfidence = Math.random() < 0.3; // 30% chance of low confidence

    setOcrResult({
      ...extractedData,
      confidence: lowConfidence ? 'Low' : 'High',
    });

    if (lowConfidence) {
      setManualReviewPrompt(true);
      displayMessage('info', 'OCR completed with low confidence. Manual review/correction required.');
      updateApplication(applicationId, {
        ocrExtractedData: extractedData,
        documentVerificationStatus: 'Manual Review Required',
        auditTrail: [
          ...(app?.auditTrail || []),
          { timestamp: new Date().toISOString(), user: 'OCR System', action: `OCR processed, low confidence. Manual review flagged.` }
        ]
      });
    } else {
      displayMessage('success', 'OCR processing completed successfully. Data extracted.');
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
    <div className="dashboard-card">
      <h5>Automatic Extraction of Data from Documents (OCR Mock)</h5>
      <form onSubmit={handleProcessOCR}>
        <div className="form-group">
          <label htmlFor="ocrAppId">Application ID with uploaded documents:</label>
          <input
            type="text"
            id="ocrAppId"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="e.g., LA001, LA002, NOOCR"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing OCR...' : 'Run OCR on Documents'}
          </button>
        </div>
      </form>

      {ocrResult && (
        <div style={{ marginTop: '1.5rem' }}>
          <h6>OCR Results for Application {applicationId}:</h6>
          <p>Extracted Name: <strong>{ocrResult.name}</strong></p>
          <p>Extracted ID Number: <strong>{ocrResult.idNumber}</strong></p>
          <p>Extracted Income: <strong>${ocrResult.income.toLocaleString()}</strong></p>
          <p>Confidence: {ocrResult.confidence}</p>
        </div>
      )}

      {manualReviewPrompt && (
        <p className="info-message" style={{ marginTop: '1rem' }}>
          <strong>Manual Review Required:</strong> OCR returned low confidence. Please review the extracted fields
          and manually correct them in the application record.
        </p>
      )}
    </div>
  );
};

export default OCRProcessorMock;