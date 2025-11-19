import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useNotification } from '../common/Notification';
import { simulateOCRProcessing } from '../../utils/api';
import '../../styles/OCR.css';

function OCRDataDisplay() {
  const [extractedData, setExtractedData] = useState(null);
  const [confidence, setConfidence] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showNotification } = useNotification();

  const simulateDocumentUpload = async () => {
    setIsProcessing(true);
    setExtractedData(null);
    setConfidence(100);

    try {
      const result = await simulateOCRProcessing();
      setExtractedData(result.data);
      setConfidence(result.confidence);
      if (result.confidence < 80) {
        showNotification('OCR returned low confidence. Please review and correct fields.', 'warning');
      } else {
        showNotification('Document data extracted successfully!', 'success');
      }
    } catch (error) {
      showNotification(`OCR processing failed: ${error.message}. Manual entry triggered.`, 'error');
      setExtractedData({ name: 'Manual Entry Required', idNumber: 'Manual Entry Required', income: 'Manual Entry Required' });
      setConfidence(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card title="Automatic Extraction of Data from Documents">
      <p>As a system, I want to extract name, ID number, and income details from uploaded documents using OCR so that verification is automated.</p>
      <div className="ocr-feature-container">
        <Button onClick={simulateDocumentUpload} disabled={isProcessing}>
          {isProcessing ? 'Processing Document...' : 'Simulate Document Upload & OCR'}
        </Button>

        {extractedData && (
          <div className="ocr-results card">
            <h4>Extracted Data:</h4>
            <p><strong>Name:</strong> {extractedData.name}</p>
            <p><strong>ID Number:</strong> {extractedData.idNumber}</p>
            <p><strong>Income:</strong> {extractedData.income}</p>
            <p><strong>OCR Confidence:</strong> {confidence}%</p>
            {confidence < 80 && (
              <div className="manual-review-prompt">
                <p className="warning-message">Low confidence detected. Manual review and correction may be needed.</p>
                <Button variant="secondary">Review/Correct Fields</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default OCRDataDisplay;