import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // For conditional classNames

const DocumentUpload = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplication } = useLoan();
  const [selectedFile, setSelectedFile] = useState(null);
  const [applicationId, setApplicationId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); // Tracks files per task instance for current session
  const [loading, setLoading] = useState(false);

  // Guardrail: Only authenticated customers can upload documents for their applications
  if (!isAuthenticated || user?.role !== 'customer') {
    displayMessage('destructive', 'Access Denied', 'You must be logged in as a customer to upload documents.');
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
          <CardDescription>Upload Identity and Income Documents</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Only authenticated customers can upload documents.
            Please login with 'john.doe@fintrust.com' or 'jane.smith@fintrust.com' (password: 'password123')
            to try this feature.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!applicationId) {
      displayMessage('destructive', 'Validation Error', 'Please enter an Application ID first.');
      return;
    }

    if (!selectedFile) {
      displayMessage('destructive', 'Validation Error', 'Please select a file to upload.');
      return;
    }

    setLoading(true);

    const MAX_FILE_SIZE_MB = 2; // 2MB
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      displayMessage('destructive', 'Upload Failed', `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      setSelectedFile(null);
      setLoading(false);
      return;
    }

    const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!SUPPORTED_FORMATS.includes(selectedFile.type)) {
      displayMessage('destructive', 'Upload Failed', 'Unsupported file format. Only JPG, PNG, PDF are allowed.');
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
        status: 'Documents Uploaded', // Update status after upload
        auditTrail: [
          ...(currentApp.auditTrail || []),
          { timestamp: new Date().toISOString(), user: user.username, action: `Document uploaded: ${newFileEntry.name}` }
        ]
      });
    } else {
      displayMessage('destructive', 'Upload Failed', 'Application not found or does not belong to you.');
    }


    setSelectedFile(null);
    setLoading(false);
  };

  const handleRemoveFile = (fileNameToRemove) => {
    setUploadedFiles((prev) => prev.filter(file => file.name !== fileNameToRemove));
    displayMessage('info', 'File Removed', `${fileNameToRemove} removed.`);
    // In a real app, this would also update the backend/context
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Identity and Income Documents</CardTitle>
        <CardDescription>Upload required documents for bank verification.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="uploadAppId">Application ID to attach documents</Label>
            <Input
              id="uploadAppId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g., LA001 (must be your application)"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-upload-input" className="block text-sm font-medium text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Drag & drop or click to select document (JPG, PNG, PDF, max 2MB)'}
            </Label>
            <Input
              id="document-upload-input"
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              className="file:text-primary file:font-semibold"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={!selectedFile || !applicationId || loading}>
            {loading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </form>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h6 className="text-lg font-semibold">Uploaded Documents:</h6>
            <ul className="list-disc pl-5 space-y-1">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between text-muted-foreground">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(file.name)} className="text-destructive">
                    &times;
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;