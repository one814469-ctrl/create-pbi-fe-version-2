import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useNotification } from '../common/Notification';
import { uploadDocument } from '../../utils/api';
import '../../styles/Upload.css';

const MAX_FILE_SIZE_MB = 5;
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'application/pdf'];

function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { showNotification } = useNotification();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showNotification('Please select a file to upload.', 'warning');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showNotification(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`, 'error');
      return;
    }

    if (!SUPPORTED_FORMATS.includes(selectedFile.type)) {
      showNotification('Unsupported file format. Please upload JPG, PNG, or PDF.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadDocument(selectedFile);
      setUploadedFiles((prev) => [...prev, { name: selectedFile.name, status: 'Uploaded', id: response.id }]);
      showNotification(`File "${selectedFile.name}" uploaded successfully!`, 'success');
      setSelectedFile(null);
    } catch (error) {
      showNotification(`Upload failed for "${selectedFile.name}": ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card title="Upload Identity and Income Documents">
      <p>As an applicant, I want to upload required documents so that the bank can verify my identity and income.</p>
      <div className="upload-container">
        <input
          type="file"
          id="document-upload"
          onChange={handleFileChange}
          className="file-input"
          accept={SUPPORTED_FORMATS.join(',')}
        />
        <label htmlFor="document-upload" className="file-input-label">
          {selectedFile ? selectedFile.name : 'Choose File'}
        </label>
        <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files-list">
          <h4>Uploaded Documents:</h4>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                {file.name} - <span className={`status-${file.status.toLowerCase()}`}>{file.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="upload-hint">
        Supported formats: JPG, PNG, PDF. Maximum size: {MAX_FILE_SIZE_MB}MB.
      </p>
    </Card>
  );
}

export default DocumentUpload;