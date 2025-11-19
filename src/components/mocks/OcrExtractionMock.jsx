import React, { useState } from 'react';
import Button from '../ui/Button';

const OcrExtractionMock = ({ onUpdateApplication, task }) => {
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ocrServiceAvailable, setOcrServiceAvailable] = useState(true);

  const simulateOcrExtraction = () => {
    setIsLoading(true);
    setExtractedData(null);
    setOcrServiceAvailable(Math.random() > 0.1);

    setTimeout(() => {
      if (!ocrServiceAvailable) {
        setExtractedData({ status: 'error', message: 'OCR service is currently unavailable. Manual data entry triggered.' });
        onUpdateApplication && onUpdateApplication(prev => ({
          ...prev,
          ocrData: { status: 'Failed', reason: 'Service Unavailable' },
          history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: 'OCR Extraction Failed (Service Unavailable)' }]
        }));
        setIsLoading(false);
        return;
      }

      const lowConfidence = Math.random() > 0.8;
      const data = {
        name: 'Jane Doe',
        idNumber: '123-45-678',
        incomeDetails: '$5,000/month',
        confidence: lowConfidence ? 'Low' : 'High',
        status: 'success'
      };
      setExtractedData(data);
      onUpdateApplication && onUpdateApplication(prev => ({
        ...prev,
        ocrData: data,
        history: [...(prev.history || []), { timestamp: new Date().toISOString(), action: `OCR Extraction: ${lowConfidence ? 'Low Confidence' : 'Success'}` }]
      }));
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="ocr-extraction-mock">
      <h4>Automatic Extraction of Data from Documents (OCR)</h4>
      <p>Simulates OCR processing an uploaded document to extract key information.</p>
      <Button onClick={simulateOcrExtraction} disabled={isLoading} className="button-secondary">
        {isLoading ? 'Processing OCR...' : 'Simulate OCR Extraction'}
      </Button>
      {extractedData && (
        <div className={`mock-api-response mt-4 ${extractedData.status}`}>
          <h5>Extracted Data:</h5>
          {extractedData.status === 'success' ? (
            <>
              <p><strong>Name:</strong> {extractedData.name}</p>
              <p><strong>ID Number:</strong> {extractedData.idNumber}</p>
              <p><strong>Income Details:</strong> {extractedData.incomeDetails}</p>
              <p><strong>Confidence:</strong> {extractedData.confidence}</p>
              {extractedData.confidence === 'Low' && task && task.acceptance_criteria[1] ? (
                <p className="error-message mt-2">
                  <em>Acceptance Criteria (Edge): {task.acceptance_criteria[1]} (Mocked: Applicant prompted to manually review/correct fields)</em>
                </p>
              ) : (
                task && task.acceptance_criteria[0] && (
                  <p className="success-message mt-2">
                    <em>Acceptance Criteria (Positive): {task.acceptance_criteria[0]} (Mocked: Extracted fields auto-populated)</em>
                  </p>
                )
              )}
            </>
          ) : (
            task && task.acceptance_criteria[2] && (
              <p className="error-message mt-2">
                {extractedData.message}
                <em>Acceptance Criteria (Negative): {task.acceptance_criteria[2]} (Mocked: Manual data entry triggered)</em>
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default OcrExtractionMock;