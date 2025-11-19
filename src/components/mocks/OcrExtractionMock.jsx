import React, { useState } from 'react';
import Button from '../ui/Button';

const OcrExtractionMock = ({ onUpdateApplication }) => {
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const simulateOcrExtraction = () => {
    setIsLoading(true);
    // Simulate OCR processing time
    setTimeout(() => {
      const lowConfidence = Math.random() > 0.8; // 20% chance of low confidence
      const data = {
        name: 'Jane Doe',
        idNumber: '123-45-678',
        incomeDetails: '$5,000/month',
        confidence: lowConfidence ? 'Low' : 'High',
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
        <div className="mock-api-response mt-4">
          <h5>Extracted Data:</h5>
          <p><strong>Name:</strong> {extractedData.name}</p>
          <p><strong>ID Number:</strong> {extractedData.idNumber}</p>
          <p><strong>Income Details:</strong> {extractedData.incomeDetails}</p>
          <p><strong>Confidence:</strong> {extractedData.confidence}</p>
          {extractedData.confidence === 'Low' ? (
            <p className="error-message">
              <em>Edge Case: "Given OCR returns low confidence on extracted data, When verification is attempted, Then the applicant is prompted to manually review/correct fields" (Mocked)</em>
            </p>
          ) : (
            <p className="success-message">
              <em>Acceptance Criteria: "Given a document is uploaded, When OCR processes the document, Then the extracted fields are auto-populated in the application record" (Mocked)</em>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OcrExtractionMock;