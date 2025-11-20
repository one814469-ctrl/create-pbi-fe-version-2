import React, { useState } from 'react'
import PBIBlock from '../components/PBIBlock'
import OCRIntegrationFeature from '../features/document-verification/OCRIntegrationFeature'

const AutomatedDocumentVerificationPage = ({ epic }) => {
  const [processingStatus, setProcessingStatus] = useState('Idle')
  const [logs, setLogs] = useState([])

  const handleProcessDocuments = (documentCount) => {
    setProcessingStatus('Processing')
    const newLog = {
      timestamp: new Date().toLocaleString(),
      message: `Initiating OCR for ${documentCount} documents.`,
      type: 'info'
    }
    setLogs(prev => [...prev, newLog])

    setTimeout(() => {
      const isApiAvailable = Math.random() > 0.1
      const lowConfidence = Math.random() > 0.7

      if (!isApiAvailable) {
        setProcessingStatus('Failed (API Unavailable)')
        setLogs(prev => [...prev, {
          timestamp: new Date().toLocaleString(),
          message: 'OCR API unavailable. Triggering fallback manual verification workflow.',
          type: 'error'
        }])
      } else if (lowConfidence) {
        setProcessingStatus('Completed with Exceptions')
        setLogs(prev => [...prev, {
          timestamp: new Date().toLocaleString(),
          message: `OCR completed for ${documentCount} documents, but some had low-confidence results. Flagged for manual review.`,
          type: 'warning'
        }])
      } else {
        setProcessingStatus('Completed Successfully')
        setLogs(prev => [...prev, {
          timestamp: new Date().toLocaleString(),
          message: `OCR processing completed successfully for ${documentCount} documents. Results stored.`,
          type: 'success'
        }])
      }
    }, 3000)
  }

  return (
    <div className="automated-document-verification-page">
      <h1>{epic.title}</h1>
      <p>{epic.description}</p>

      {epic.userStories.map((story) => (
        <PBIBlock key={story.title} title={story.title} description={story.description} type="user-story">
          {story.component === "OCRIntegrationFeature" && (
            <OCRIntegrationFeature
              task={story.tasks[0]}
              onProcessDocuments={handleProcessDocuments}
              processingStatus={processingStatus}
              logs={logs}
            />
          )}
        </PBIBlock>
      ))}
    </div>
  )
}

export default AutomatedDocumentVerificationPage