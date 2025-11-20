import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialMockApplications } from '../data/mockApplications';

const ApplicationContext = createContext(null);

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState(() => {
    const storedApplications = localStorage.getItem('applications');
    return storedApplications ? JSON.parse(storedApplications) : initialMockApplications;
  });

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  const addApplication = (newApp) => {
    const appWithId = {
      ...newApp,
      id: `app-${(applications.length + 1).toString().padStart(3, '0')}`,
      submissionDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'submitted',
      documents: [],
      creditScore: null,
      creditReport: null,
      ocrStatus: 'pending',
      manualReviewRequired: false,
      auditTrail: [{ timestamp: new Date().toISOString(), user: 'Applicant', action: 'Application submitted' }],
    };
    setApplications((prev) => [...prev, appWithId]);
    console.log(`Notification: Confirmation email and SMS sent for application ${appWithId.id}`);
    return appWithId.id;
  };

  const getApplicationById = (id) => applications.find((app) => app.id === id);

  const updateApplication = (id, updates) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, ...updates, lastUpdated: new Date().toISOString() } : app,
      ),
    );
  };

  const addDocument = (appId, file) => {
    const app = getApplicationById(appId);
    if (!app) return;

    const newDocument = {
      name: file.name,
      type: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
      status: 'pending',
      extractedData: null,
    };

    const updatedDocuments = [...app.documents, newDocument];
    const newAuditEntry = { timestamp: new Date().toISOString(), user: 'Applicant', action: `Document uploaded: ${file.name}` };
    updateApplication(appId, {
      documents: updatedDocuments,
      auditTrail: [...app.auditTrail, newAuditEntry],
    });

    console.log(`Simulating document verification for ${file.name}`);
    setTimeout(() => {
      let docStatus = 'verified';
      let extractedData = null;
      let reason = null;
      if (file.name.includes('corrupted') || file.name.includes('malicious')) {
        docStatus = 'rejected';
        reason = 'Corrupted or malicious file detected';
        console.warn(`Notification: Document ${file.name} rejected for application ${appId}`);
      } else if (!['pdf', 'jpg', 'png'].some(ext => file.name.toLowerCase().endsWith(ext))) {
        docStatus = 'rejected';
        reason = 'Unsupported file format';
        console.warn(`Notification: Document ${file.name} rejected due to unsupported format for application ${appId}`);
      } else {
        extractedData = { placeholder: 'extracted data' };
      }

      setApplications((prevApps) =>
        prevApps.map((a) =>
          a.id === appId
            ? {
                ...a,
                documents: a.documents.map((d) =>
                  d.name === file.name ? { ...d, status: docStatus, extractedData, reason } : d,
                ),
                auditTrail: [
                  ...a.auditTrail,
                  { timestamp: new Date().toISOString(), user: 'System', action: `Document verification for ${file.name} ${docStatus === 'verified' ? 'completed' : 'failed'}` },
                ],
                lastUpdated: new Date().toISOString(),
              }
            : a,
        ),
      );
    }, 2000);
  };

  const simulateReminder = (appId) => {
    const app = getApplicationById(appId);
    if (app && app.documents.some(doc => doc.status === 'pending')) {
      const newAuditEntry = { timestamp: new Date().toISOString(), user: 'System', action: 'Missing documents reminder sent' };
      updateApplication(appId, { auditTrail: [...app.auditTrail, newAuditEntry] });
      console.log(`Notification: Reminder email/SMS sent for application ${appId} (missing documents)`);
    }
  };

  const simulateDecisionNotification = (appId, decision) => {
    const app = getApplicationById(appId);
    if (app && (decision === 'approved' || decision === 'rejected')) {
      const newAuditEntry = { timestamp: new Date().toISOString(), user: 'System', action: `Final decision notification sent: ${decision}` };
      updateApplication(appId, { auditTrail: [...app.auditTrail, newAuditEntry] });
      console.log(`Notification: Final decision email/SMS sent for application ${appId}: ${decision.toUpperCase()}`);
    }
  };

  const simulateOCRProcessing = (appId) => {
    const app = getApplicationById(appId);
    if (!app) return;
    const newAuditEntry = { timestamp: new Date().toISOString(), user: 'Loan Officer', action: 'OCR processing initiated' };
    updateApplication(appId, { auditTrail: [...app.auditTrail, newAuditEntry] });
    console.log(`Simulating OCR processing for application ${appId}`);

    setTimeout(() => {
      const ocrSuccess = Math.random() > 0.3;
      let updatedOcrStatus = ocrSuccess ? 'completed' : 'failed';
      let manualReviewNeeded = !ocrSuccess;

      setApplications((prevApps) =>
        prevApps.map((a) =>
          a.id === appId
            ? {
                ...a,
                ocrStatus: updatedOcrStatus,
                manualReviewRequired: manualReviewNeeded,
                documents: a.documents.map(doc => ({
                  ...doc,
                  extractedData: ocrSuccess ? { ...doc.extractedData, ocr: 'extracted' } : doc.extractedData,
                  status: ocrSuccess ? doc.status : (doc.status === 'verified' ? 'manual-review' : doc.status),
                })),
                auditTrail: [
                  ...a.auditTrail,
                  { timestamp: new Date().toISOString(), user: 'System', action: `OCR processing: ${updatedOcrStatus}. Manual review ${manualReviewNeeded ? 'required' : 'not required'}.` },
                ],
                lastUpdated: new Date().toISOString(),
              }
            : a,
        ),
      );
    }, 3000);
  };

  const simulateCreditCheck = (appId) => {
    const app = getApplicationById(appId);
    if (!app) return;

    const newAuditEntry = { timestamp: new Date().toISOString(), user: 'Loan Officer', action: 'Credit check initiated' };
    updateApplication(appId, { auditTrail: [...app.auditTrail, newAuditEntry] });
    console.log(`Simulating credit check for application ${appId}`);

    setTimeout(() => {
      const apiAvailable = Math.random() > 0.1;
      if (!apiAvailable) {
        setApplications((prevApps) =>
          prevApps.map((a) =>
            a.id === appId
              ? {
                  ...a,
                  auditTrail: [
                    ...a.auditTrail,
                    { timestamp: new Date().toISOString(), user: 'System', action: 'Credit Bureau API unavailable. Manual review prompted.' },
                  ],
                  lastUpdated: new Date().toISOString(),
                }
              : a,
          ),
        );
        alert('Credit Bureau API is unavailable. Please perform a manual credit review.');
      } else {
        const score = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
        setApplications((prevApps) =>
          prevApps.map((a) =>
            a.id === appId
              ? {
                  ...a,
                  creditScore: score,
                  creditReport: `Mock credit report details for ${a.applicantName} (Score: ${score}).`,
                  auditTrail: [
                    ...a.auditTrail,
                    { timestamp: new Date().toISOString(), user: 'System', action: `Credit score retrieved: ${score}` },
                  ],
                  lastUpdated: new Date().toISOString(),
                }
              : a,
          ),
        );
      }
    }, 2500);
  };

  const submitToCoreSystem = (appId) => {
    const app = getApplicationById(appId);
    if (!app || app.status !== 'approved') {
      alert('Application must be approved before submitting to Core System.');
      return;
    }

    const newAuditEntry = { timestamp: new Date().toISOString(), user: 'Loan Officer', action: 'Submission to Core Banking System initiated' };
    updateApplication(appId, { auditTrail: [...app.auditTrail, newAuditEntry] });
    console.log(`Simulating submission to Core Banking System for application ${appId}`);

    setTimeout(() => {
      const apiAvailable = Math.random() > 0.1;
      const validationPasses = Math.random() > 0.2;

      if (!apiAvailable) {
        setApplications((prevApps) =>
          prevApps.map((a) =>
            a.id === appId
              ? {
                  ...a,
                  auditTrail: [
                    ...a.auditTrail,
                    { timestamp: new Date().toISOString(), user: 'System', action: 'Core Banking System API is down. Submission failed.' },
                  ],
                  lastUpdated: new Date().toISOString(),
                }
              : a,
          ),
        );
        alert('Core Banking System API is down. Please try again later.');
      } else if (!validationPasses) {
        setApplications((prevApps) =>
          prevApps.map((a) =>
            a.id === appId
              ? {
                  ...a,
                  auditTrail: [
                    ...a.auditTrail,
                    { timestamp: new Date().toISOString(), user: 'System', action: 'Core Banking System validation failed. Reason: Missing required fields.' },
                  ],
                  lastUpdated: new Date().toISOString(),
                }
              : a,
          ),
        );
        alert('Submission failed: Application failed core system validation (mock reason).');
      } else {
        setApplications((prevApps) =>
          prevApps.map((a) =>
            a.id === appId
              ? {
                  ...a,
                  status: 'processed-by-core-system',
                  auditTrail: [
                    ...a.auditTrail,
                    { timestamp: new Date().toISOString(), user: 'System', action: 'Application successfully submitted to Core Banking System.' },
                  ],
                  lastUpdated: new Date().toISOString(),
                }
              : a,
          ),
        );
        alert(`Application ${appId} successfully submitted to Core Banking System.`);
      }
    }, 3000);
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        addApplication,
        getApplicationById,
        updateApplication,
        addDocument,
        simulateReminder,
        simulateDecisionNotification,
        simulateOCRProcessing,
        simulateCreditCheck,
        submitToCoreSystem,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => useContext(ApplicationContext);