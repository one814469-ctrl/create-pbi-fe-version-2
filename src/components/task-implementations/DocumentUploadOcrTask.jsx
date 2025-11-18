import React, { useState } from 'react';
import FileUploadMock from '../ui/FileUploadMock';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { mockOcrService } from '../../lib/api/mockApi';

const DocumentUploadOcrTask = ({ task }) => {
  const showToast = useToast();
  const [files, setFiles] = useState([]); // { id, file, status, data/error }
  const [isLoadingFileId, setIsLoadingFileId] = useState(null);
  const [showReuploadModal, setShowReuploadModal] = useState(false);
  const [reuploadFileDetails, setReuploadFileDetails] = useState(null);

  const handleFilesSelect = (selectedFiles) => {
    const newFiles = selectedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      status: 'pending',
      data: null,
      error: null,
      requiresReupload: false
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    newFiles.forEach(fileItem => simulateOcr(fileItem));
  };

  const handleFileRemove = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    showToast('File removed successfully.', 'info');
  };

  const simulateOcr = async (fileItem) => {
    setIsLoadingFileId(fileItem.id);
    setFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, status: 'processing' } : f));

    try {
      const result = await mockOcrService(fileItem.file);
      setFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, status: result.status, data: result.data } : f));
      showToast(`OCR for ${fileItem.file.name} ${result.status}.`, 'success');
    } catch (error) {
      setFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, status: error.status, error: error.error, requiresReupload: error.requiresReupload } : f));
      showToast(`OCR for ${fileItem.file.name} failed: ${error.error}`, 'error');
      if (error.requiresReupload) {
        setReuploadFileDetails({ id: fileItem.id, name: fileItem.file.name, reason: error.error });
        setShowReuploadModal(true);
      }
    } finally {
      setIsLoadingFileId(null);
    }
  };

  const handleReuploadConfirm = () => {
    // In a real app, this would remove the problematic file and prompt for re-upload.
    // Here, we just remove it from the list and close the modal.
    if (reuploadFileDetails) {
      handleFileRemove(reuploadFileDetails.id);
      showToast(`Please re-upload a clearer version of ${reuploadFileDetails.name}.`, 'info', 5000);
    }
    setShowReuploadModal(false);
    setReuploadFileDetails(null);
  };

  return (
    <div>
      <h5>{task.title}</h5>
      <FileUploadMock
        onFilesSelect={handleFilesSelect}
        onFileRemove={handleFileRemove}
        uploadedFiles={files.map(f => ({ id: f.id, file: f.file }))}
        acceptedFormats=".pdf,.jpg,.png"
      />

      <div style={{ marginTop: 'var(--spacing-m)' }}>
        <h6>Document Processing Status:</h6>
        {files.length === 0 && <p style={{ color: 'var(--color-muted)' }}>No documents to display status for.</p>}
        {files.map((fileItem) => (
          <div
            key={fileItem.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xs)',
              marginBottom: 'var(--spacing-s)',
              padding: 'var(--spacing-s)',
              border: '1px solid #eee',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: '#fcfcfc',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', color: 'var(--color-ink)' }}>{fileItem.file.name}</span>
              {isLoadingFileId === fileItem.id && <span className="status-indicator processing">Processing...</span>}
              {fileItem.status === 'verified' && <span className="status-indicator verified">Verified</span>}
              {fileItem.status === 'rejected' && <span className="status-indicator rejected">Rejected</span>}
              {fileItem.status === 'pending' && <span className="status-indicator pending">Pending</span>}
            </div>
            {fileItem.data && fileItem.status === 'verified' && (
              <div className="info-message" style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: 'var(--spacing-s)', backgroundColor: '#eff8f8' }}>
                Extracted Data: {fileItem.data.extractedText}
              </div>
            )}
            {fileItem.error && fileItem.status === 'rejected' && (
              <div className="error-message" style={{ borderLeft: '3px solid var(--color-error)', paddingLeft: 'var(--spacing-s)', backgroundColor: '#fef5f5' }}>
                Reason: {fileItem.error}
                {fileItem.requiresReupload && <p><em>(System flags for re-upload.)</em></p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={showReuploadModal}
        onClose={() => setShowReuploadModal(false)}
        title="Document Verification Failed"
        footer={<Button onClick={handleReuploadConfirm} variant="primary">Acknowledge & Re-upload</Button>}
      >
        <p>
          The document "<strong>{reuploadFileDetails?.name}</strong>" could not be verified due to:
          <br />
          <em>{reuploadFileDetails?.reason}</em>
        </p>
        <p style={{ marginTop: 'var(--spacing-s)' }}>
          Please re-upload a clearer scan or an alternative document for processing.
        </p>
      </Modal>
    </div>
  );
};

export default DocumentUploadOcrTask;