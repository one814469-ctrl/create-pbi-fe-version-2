import React, { useState } from 'react'

const OCRIntegrationFeature = ({ task, onProcessDocuments, processingStatus, logs }) => {
  const [numDocuments, setNumDocuments] = useState(5)

  const handleInitiateOCR = () => {
    onProcessDocuments(numDocuments)
  }

  return (
    <div className="card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      <div className="form-group">
        <label htmlFor="numDocs">Number of mock documents to process:</label>
        <input
          type="number"
          id="numDocs"
          value={numDocuments}
          onChange={(e) => setNumDocuments(parseInt(e.target.value) || 1)}
          min="1"
        />
      </div>

      <button onClick={handleInitiateOCR} disabled={processingStatus === 'Processing'}>
        {processingStatus === 'Processing' ? 'Processing...' : 'Initiate OCR Process'}
      </button>

      <p style={{ marginTop: '20px' }}><strong>Current OCR System Status:</strong> {processingStatus}</p>

      <h5>Processing Log:</h5>
      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-muted)', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        {logs.length === 0 ? (
          <p>No log entries yet.</p>
        ) : (
          <ul>
            {logs.map((log, index) => (
              <li key={index} className={`alert alert-${log.type}`}>
                [{log.timestamp}] {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default OCRIntegrationFeature