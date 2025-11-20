import React, { useState, useRef } from 'react';
import { useApplications } from '../../context/ApplicationContext';

const DocumentUpload = ({ appId, currentDocuments }) => {
  const { addDocument } = useApplications();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage('');
    setMessageType('');

    const supportedFormats = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxFileSize = 5 * 1024 * 1024;

    if (!supportedFormats.includes(file.type)) {
      setMessage('Unsupported file format. Please upload PDF, JPG, or PNG.');
      setMessageType('error');
      return;
    }
    if (file.size > maxFileSize) {
      setMessage('File size exceeds 5MB limit.');
      setMessageType('error');
      return;
    }

    addDocument(appId, file);
    setMessage(`Document "${file.name}" uploaded. Verification in progress...`);
    setMessageType('info');
    e.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="card">
      <h4>Document Upload & Verification</h4>
      {message && <div className={`message-${messageType}`}>{message}</div>}
      <p>Accepted formats: PDF, JPG, PNG. Max file size: 5MB.</p>
      <div className="document-upload-area" onClick={triggerFileInput}>
        Click or drag files here to upload
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>
      {currentDocuments && currentDocuments.length > 0 && (
        <div style={{ marginTop: '1.5em' }}>
          <h5>Uploaded Documents</h5>
          <ul className="document-list">
            {currentDocuments.map((doc, index) => (
              <li key={index}>
                <span>{doc.name} ({doc.type})</span>
                <span className={`status-badge ${doc.status}`}>{doc.status}</span>
                {doc.reason && <span className="message-error" style={{marginLeft: '1em'}}>{doc.reason}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;