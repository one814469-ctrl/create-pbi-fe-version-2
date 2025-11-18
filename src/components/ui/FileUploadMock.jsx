import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

const FileUploadMock = ({ onFilesSelect, onFileRemove, label = 'Upload Documents', acceptedFormats = '.pdf,.jpg,.png', multiple = true, uploadedFiles = [] }) => {
  const handleFileChange = (e) => {
    if (onFilesSelect) {
      onFilesSelect(Array.from(e.target.files));
    }
    e.target.value = null; // Clear input for re-uploading same file
  };

  return (
    <div style={{ border: '1px dashed #ccc', padding: 'var(--spacing-m)', borderRadius: 'var(--border-radius-sm)', backgroundColor: '#f9f9f9' }}>
      <label htmlFor="file-upload" style={{ display: 'block', marginBottom: 'var(--spacing-s)', fontWeight: 'bold' }}>{label}</label>
      <input
        id="file-upload"
        type="file"
        multiple={multiple}
        accept={acceptedFormats}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button variant="secondary" onClick={() => document.getElementById('file-upload').click()}>
        Browse Files
      </Button>

      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: 'var(--spacing-m)' }}>
          <h6>Uploaded Files:</h6>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {uploadedFiles.map(fileItem => (
              <li key={fileItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-xs) 0', borderBottom: '1px solid #eee' }}>
                <span>{fileItem.file.name} ({Math.round(fileItem.file.size / 1024)} KB)</span>
                {onFileRemove && (
                  <Button variant="danger" onClick={() => onFileRemove(fileItem.id)} style={{ padding: '4px 8px', fontSize: '0.8em' }}>
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploadMock;