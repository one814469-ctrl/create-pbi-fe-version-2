import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';

const DocumentUpload = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplication } = useLoan();
  const [selectedFile, setSelectedFile] = useState(null);
  const [applicationId, setApplicationId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); // Tracks files per task instance for current session
  const [loading, setLoading] = useState(false);

  // Guardrail: Only authenticated customers can upload documents for their applications
  if (!isAuthenticated || user?.role !== 'customer') {
    displayMessage('error', 'Access Denied', 'You must be logged in as a customer to upload documents.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Upload Identity and Income Documents</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only authenticated customers can upload documents.
            Please login with 'john.doe@fintrust.com' or 'jane.smith@fintrust.com' (password: 'password123')
            to try this feature.
          </p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!applicationId) {
      displayMessage('error', 'Validation Error', 'Please enter an Application ID first.');
      return;
    }

    if (!selectedFile) {
      displayMessage('error', 'Validation Error', 'Please select a file to upload.');
      return;
    }

    setLoading(true);

    const MAX_FILE_SIZE_MB = 2; // 2MB
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      displayMessage('error', 'Upload Failed', `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      setSelectedFile(null);
      setLoading(false);
      return;
    }

    const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!SUPPORTED_FORMATS.includes(selectedFile.type)) {
      displayMessage('error', 'Upload Failed', 'Unsupported file format. Only JPG, PNG, PDF are allowed.');
      setSelectedFile(null);
      setLoading(false);
      return;
    }

    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newFileEntry = { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size };
    setUploadedFiles((prev) => [...prev, newFileEntry]);
    displayMessage('success', 'Upload Successful', `${selectedFile.name} uploaded successfully!`);

    const currentApp = applications.find(app => app.id === applicationId && app.customerID === user.customerID);

    if (currentApp) {
      updateApplication(applicationId, {
        documents: [...(currentApp.documents || []), newFileEntry.name],
        status: 'Documents Uploaded',
        auditTrail: [
          ...(currentApp.auditTrail || []),
          { timestamp: new Date().toISOString(), user: user.username, action: `Document uploaded: ${newFileEntry.name}` }
        ]
      });
    } else {
      displayMessage('error', 'Upload Failed', 'Application not found or does not belong to you.');
    }

    setSelectedFile(null);
    setLoading(false);
  };

  const handleRemoveFile = (fileNameToRemove) => {
    setUploadedFiles((prev) => prev.filter(file => file.name !== fileNameToRemove));
    displayMessage('info', 'File Removed', `${fileNameToRemove} removed.`);
  };

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">Upload Identity and Income Documents</h3>
        <p className="card-description">Upload required documents for bank verification.</p>
      </div>
      <div className="card-content space-y-6">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="uploadAppId" className="block text-sm font-medium">Application ID to attach documents</label>
            <input
              id="uploadAppId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g., LA001 (must be your application)"
              required
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="document-upload-input" className="block text-sm font-medium text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Drag & drop or click to select document (JPG, PNG, PDF, max 2MB)'}
            </label>
            <input
              id="document-upload-input"
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              disabled={loading}
              className="w-full"
            />
          </div>
          <button type="submit" disabled={!selectedFile || !applicationId || loading}>
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Uploaded Documents:</h6>
            <ul className="list-disc pl-5 space-y-1">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="flex-row items-center justify-between text-muted-foreground">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  <button type="button" onClick={() => handleRemoveFile(file.name)} className="button-ghost text-destructive">
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;