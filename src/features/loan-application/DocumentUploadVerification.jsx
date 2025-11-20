import React, { useState } from 'react'

const DocumentUploadVerification = ({ task, applicationId, onDocumentUpload }) => {
  const [documentType, setDocumentType] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')

  const supportedFileTypes = ['image/jpeg', 'image/png', 'application/pdf']

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
    setError('')
    setUploadMessage('')
  }

  const handleUpload = (e) => {
    e.preventDefault()
    setError('')
    setUploadMessage('')

    if (!documentType || !selectedFile) {
      setError('Please select a document type and a file.')
      return
    }

    if (!supportedFileTypes.includes(selectedFile.type)) {
      setError(`Unsupported file type: ${selectedFile.type}. Please upload JPG, PNG, or PDF.`)
      return
    }

    setUploadMessage('Uploading and verifying document...')

    setTimeout(() => {
      const isReadable = Math.random() > 0.1
      if (!isReadable) {
        setUploadMessage(`Document "${selectedFile.name}" uploaded. Verification failed (unreadable/corrupted). Flagged for manual review.`)
        onDocumentUpload(applicationId, selectedFile.name, 'Manual Review Required')
        setError('Document unreadable or corrupted. Manual review required.')
      } else {
        setUploadMessage(`Document "${selectedFile.name}" uploaded and verified successfully via OCR.`)
        onDocumentUpload(applicationId, selectedFile.name, 'Verified')
      }
      setDocumentType('')
      setSelectedFile(null)
    }, 2000)
  }

  return (
    <div className="card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      {!applicationId && <p className="alert alert-info">Please submit an application first to upload documents.</p>}
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="documentType">Document Type:</label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            disabled={!applicationId}
          >
            <option value="">Select Document Type</option>
            <option value="ID Proof">ID Proof</option>
            <option value="Income Proof">Income Proof</option>
            <option value="Address Proof">Address Proof</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="documentFile">Upload File:</label>
          <input
            type="file"
            id="documentFile"
            onChange={handleFileChange}
            disabled={!applicationId}
          />
          {selectedFile && <p>Selected: {selectedFile.name}</p>}
        </div>
        {error && <p className="error-message">{error}</p>}
        {uploadMessage && <p className={uploadMessage.includes('successfully') ? 'success-message' : 'alert alert-warning'}>{uploadMessage}</p>}
        <button type="submit" disabled={!applicationId || !documentType || !selectedFile}>Upload Document</button>
      </form>
    </div>
  )
}

export default DocumentUploadVerification