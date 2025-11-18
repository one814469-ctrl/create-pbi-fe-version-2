import React, { useState } from 'react';

const UploadOcrTask = ({ task }) => {
  const [files, setFiles] = useState([]);
  const [processingStatus, setProcessingStatus] = useState({}); // { fileId: { status: 'pending'|'processing'|'verified'|'rejected', data: null|error, requiresReupload: boolean } }
  const [showReuploadPrompt, setShowReuploadPrompt] = useState(false);
  const [reuploadFileId, setReuploadFileId] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => {
      const id = `${file.name}-${Date.now()}`;
      return { id, file };
    });
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    newFiles.forEach(newFile => simulateOcrProcessing(newFile));
  };

  const simulateOcrProcessing = (fileToProcess) => {
    setProcessingStatus((prev) => ({
      ...prev,
      [fileToProcess.id]: { status: 'processing', data: null }
    }));

    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance of success for OCR
      if (success) {
        setProcessingStatus((prev) => ({
          ...prev,
          [fileToProcess.id]: {
            status: 'verified',
            data: {
              extractedText: `Mock OCR for ${fileToProcess.file.name}: Name: John Doe, DOB: 01/01/1990`,
              verification: 'Passed'
            },
            requiresReupload: false
          }
        }));
      } else {
        const requiresReupload = Math.random() > 0.5; // 50% chance to require re-upload on rejection
        setProcessingStatus((prev) => ({
          ...prev,
          [fileToProcess.id]: {
            status: 'rejected',
            data: 'Document unclear or data mismatch. Needs manual review.',
            requiresReupload: requiresReupload
          }
        }));
        if (requiresReupload) {
            setReuploadFileId(fileToProcess.id);
            setShowReuploadPrompt(true);
        }
      }
    }, 3000); // Simulate 3 seconds for OCR processing
  };

  const handleRemoveFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    setProcessingStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[id];
      return newStatus;
    });
  };

  const handleReuploadConfirm = () => {
    // In a real application, this would clear the specific file from the list
    // and potentially re-open the file input dialog for that specific slot.
    // For this mock, we just acknowledge and clear the prompt.
    setReuploadFileId(null);
    setShowReuploadPrompt(false);
    alert('Please re-select the affected document using the file input above.');
  };

  return (
    <div>
      <h5>{task.title}</h5>
      <input type="file" multiple onChange={handleFileChange} accept=".pdf,.jpg,.png" />
      <div style={{ marginTop: '15px' }}>
        {files.length === 0 && <p>No documents uploaded yet.</p>}
        {files.map((fileItem) => {
          const statusInfo = processingStatus[fileItem.id];
          let statusClass = '';
          if (statusInfo) {
            statusClass = statusInfo.status.toLowerCase();
          }

          return (
            <div key={fileItem.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px', border: '1px solid #555', padding: '8px', borderRadius: '4px', backgroundColor: '#3a3a3a' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ flexGrow: 1, color: '#eee' }}>
                  {fileItem.file.name} ({Math.round(fileItem.file.size / 1024)} KB)
                </span>
                <button
                  onClick={() => handleRemoveFile(fileItem.id)}
                  style={{ marginLeft: '10px', background: '#dc3545', color: 'white', padding: '5px 10px', borderRadius: '4px' }}
                >
                  Remove
                </button>
              </div>
              {statusInfo && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span className={`status-indicator ${statusClass}`}>{statusInfo.status}</span>
                  {statusInfo.status === 'verified' && (
                    <div className="mock-data-display" style={{ marginTop: '5px' }}>
                      Extracted: {statusInfo.data.extractedText}
                    </div>
                  )}
                  {statusInfo.status === 'rejected' && (
                    <div className="error-message" style={{ marginTop: '5px' }}>
                      Reason: {statusInfo.data}
                      {statusInfo.requiresReupload && (
                          <p><em>(System flags for re-upload.)</em></p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {!statusInfo && <span className="status-indicator pending">Pending Upload</span>}
            </div>
          );
        })}
      </div>
      {showReuploadPrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Document Verification Failed!</h5>
            <p>One or more of your documents (e.g., {files.find(f => f.id === reuploadFileId)?.file.name}) could not be verified and requires re-upload.</p>
            <p>Please re-upload a clearer scan or a different document.</p>
            <button onClick={handleReuploadConfirm}>Acknowledge & Re-upload</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadOcrTask;