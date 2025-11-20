import React, { useState, useEffect } from 'react'
import { useApplications } from '../../context/ApplicationContext'
import NotificationDisplay from '../NotificationDisplay'
import LoadingSpinner from '../LoadingSpinner'

function DocumentUpload({ applicationId, onUploadSuccess, onBackToStatus }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadMessage, setUploadMessage] = useState({ message: '', type: '' })
  const [loading, setLoading] = useState(false)
  const { uploadDocuments, getApplicationById } = useApplications()
  const application = getApplicationById(applicationId)

  useEffect(() => {
    if (!applicationId) {
      setUploadMessage({ message: 'No active application selected for document upload.', type: 'info' })
    }
  }, [applicationId])

  const handleFileChange = (e) => {
    setUploadMessage({ message: '', type: '' })
    setSelectedFiles(Array.from(e.target.files))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadMessage({ message: 'Please select files to upload.', type: 'error' })
      return
    }

    setLoading(true)
    try {
      await uploadDocuments(applicationId, selectedFiles)
      setUploadMessage({ message: 'Documents submitted for verification!', type: 'success' })
      setSelectedFiles([])
      onUploadSuccess()
    } catch (error) {
      setUploadMessage({ message: error.message || 'Error uploading documents. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (!application) {
    return (
      <div className="card">
        <h3>Document Upload for Application {applicationId}</h3>
        <NotificationDisplay message="Application not found or no active application." type="error" />
        <button onClick={onBackToStatus}>Go to Application Status</button>
      </div>
    )
  }

  const currentDocs = application.documents || []
  const hasUnsupportedDocs = currentDocs.some(doc => doc.status === 'unsupported-type')

  return (
    <div className="card">
      <h3>Upload Supporting Documents for Application #{applicationId.substring(4,10)}</h3>
      <p>Please upload your ID and income documents (e.g., JPEG, PNG, PDF).</p>

      {uploadMessage.message && <NotificationDisplay message={uploadMessage.message} type={uploadMessage.type} />}
      {hasUnsupportedDocs && <NotificationDisplay message="Some documents have unsupported file types. Please check." type="error" />}

      <div className="form-group">
        <label htmlFor="documentUpload">Select Files:</label>
        <input
          type="file"
          id="documentUpload"
          multiple
          onChange={handleFileChange}
          accept=".jpg, .jpeg, .png, .pdf"
          disabled={loading}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div style={{ marginBottom: '1em' }}>
          <h4>Files to upload:</h4>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name} ({file.type})</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleUpload} disabled={loading || selectedFiles.length === 0}>
        {loading ? <LoadingSpinner /> : 'Upload Documents'}
      </button>

      <h4 style={{ marginTop: '2em', borderTop: '1px solid #f0f0f0', paddingTop: '1em' }}>Current Documents:</h4>
      {currentDocs.length === 0 ? (
        <p>No documents uploaded yet for this application.</p>
      ) : (
        <ul>
          {currentDocs.map((doc, index) => (
            <li key={index}>
              {doc.name} - <span className={`status-badge ${doc.status.toLowerCase().replace(' ', '-')}`}>{doc.status.replace('-', ' ')}</span>
              {doc.message && <span style={{fontSize: '0.9em', marginLeft: '0.5em', color: 'var(--color-muted)'}}>({doc.message})</span>}
            </li>
          ))}
        </ul>
      )}

      <button onClick={onBackToStatus} style={{ marginTop: '2em', backgroundColor: 'var(--color-muted)' }}>Back to Status</button>
    </div>
  )
}

export default DocumentUpload