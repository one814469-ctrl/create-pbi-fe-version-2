import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';

const DocumentUpload = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplication } = useLoan();
  const [selectedFile, setSelectedFile] = useState(null);
  const [applicationId, setApplicationId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); // Tracks files per task instance

  // Guardrail: Only authenticated customers can upload documents for their applications
  if (!isAuthenticated || user?.role !== 'customer') {
    displayMessage('error', 'You must be logged in as a customer to upload documents.');
    return (
      <p className="error-message">
        Access Denied: Only authenticated customers can upload documents.
        Please login with 'john.doe@fintrust.com' or 'jane.smith@fintrust.com' (password: 'password123')
        to try this feature.
      </p>
    );
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!applicationId) {
      displayMessage('error', 'Please enter an Application ID first.');
      return;
    }

    if (!selectedFile) {
      displayMessage('error', 'Please select a file to upload.');
      return;
    }

    // Acceptance Criteria: [Edge] Given I upload a file that exceeds size limits
    const MAX_FILE_SIZE_MB = 2; // 2MB
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      displayMessage('error', `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      setSelectedFile(null);
      return;
    }

    // Acceptance Criteria: [Negative] Given I upload a file with an unsupported format
    const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!SUPPORTED_FORMATS.includes(selectedFile.type)) {
      displayMessage('error', 'Unsupported file format. Only JPG, PNG, PDF are allowed.');
      setSelectedFile(null);
      return;
    }

    // Simulate upload process
    setTimeout(() => {
      // Acceptance Criteria: Then each file is successfully attached to my application
      const newFileEntry = { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size };
      setUploadedFiles((prev) => [...prev, newFileEntry]);
      displayMessage('success', `${selectedFile.name} uploaded successfully!`);

      // Update mock application data in context
      updateApplication(applicationId, {
        documents: [...(applications.find(app => app.id === applicationId)?.documents || []), newFileEntry.name],
        status: 'Pending Document Review', // Update status after upload
        auditTrail: [
          ...(applications.find(app => app.id === applicationId)?.auditTrail || []),
          { timestamp: new Date().toISOString(), user: user.username, action: `Document uploaded: ${newFileEntry.name}` }
        ]
      });

      setSelectedFile(null);
    }, 1500);
  };

  const handleRemoveFile = (fileNameToRemove) => {
    setUploadedFiles((prev) => prev.filter(file => file.name !== fileNameToRemove));
    displayMessage('info', `${fileNameToRemove} removed.`);
    // In a real app, this would also update the backend/context
  };

  return (
    <div className="document-upload">
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="uploadAppId">Application ID to attach documents:</label>
          <input
            type="text"
            id="uploadAppId"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="e.g., LA001 (must be your application)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="document-upload-input" className="document-upload-container">
            {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to select document or drag & drop (JPG, PNG, PDF, max 2MB)'}
            <input
              id="document-upload-input"
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </label>
        </div>
        <div className="form-group">
          <button type="submit" disabled={!selectedFile || !applicationId}>Upload Document</button>
        </div>
      </form>

      {uploadedFiles.length > 0 && (
        <div>
          <h6>Uploaded Documents:</h6>
          <ul className="uploaded-file-list">
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                <button className="remove-btn" onClick={() => handleRemoveFile(file.name)}>
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;