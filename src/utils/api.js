import {
  mockApplications,
  mockCreditReports,
  mockAuditTrails,
  mockOCRData,
  mockDocumentVerification,
  mockComplianceRules,
  mockCustomerNotifications,
  mockEmployeeTasks,
  mockReports,
  mockCSAT
} from '../data/mockData';

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const createLoanApplication = async (formData) => {
  await simulateDelay();
  const newApplication = {
    id: `APP${String(mockApplications.length + 1).padStart(3, '0')}`,
    ...formData,
    status: 'Application Submitted',
    decision: null,
    rejectionReason: null,
    creditChecked: false,
  };
  mockApplications.push(newApplication);
  mockAuditTrails[newApplication.id] = [{
    timestamp: new Date().toISOString(),
    user: 'System',
    action: 'Application Submitted',
  }];
  return newApplication;
};

export const getLoanApplications = async () => {
  await simulateDelay();
  return mockApplications;
};

export const uploadDocument = async (file) => {
  await simulateDelay();
  if (Math.random() < 0.1) {
    throw new Error('Network error during upload.');
  }
  return { id: `DOC-${Date.now()}`, filename: file.name, size: file.size, type: file.type };
};

export const simulateOCRProcessing = async () => {
  await simulateDelay(1500);
  if (Math.random() < 0.1) {
    throw new Error('OCR service unavailable.');
  }
  const confidence = Math.random() * 100;
  return { data: mockOCRData, confidence };
};

export const getDocumentVerificationStatus = async () => {
  await simulateDelay();
  return mockDocumentVerification;
};

export const simulateDocumentVerification = async () => {
  await simulateDelay(1500);
  const random = Math.random();
  if (random < 0.1) {
    mockDocumentVerification.status = 'failed';
    mockDocumentVerification.reason = 'Mismatch in identity details.';
  } else if (random < 0.3) {
    mockDocumentVerification.status = 'pending';
    mockDocumentVerification.reason = null;
  } else {
    mockDocumentVerification.status = 'verified';
    mockDocumentVerification.reason = null;
  }
  return mockDocumentVerification;
};

export const initiateCreditCheck = async (applicantId) => {
  await simulateDelay(1500);
  const application = mockApplications.find(app => app.id === applicantId);
  if (!application) {
    throw new Error('Invalid applicant data: Application not found.');
  }

  if (Math.random() < 0.1) {
    throw new Error('Credit Bureau API timed out or is unavailable.');
  }

  const report = mockCreditReports[applicantId] || {
    score: Math.floor(Math.random() * (850 - 300 + 1)) + 300,
    summary: 'Mock credit report summary.',
    flags: Math.random() < 0.2 ? ['High debt ratio'] : [],
  };
  if (application) {
    application.creditChecked = true;
    application.status = 'Credit Check Initiated';
    mockAuditTrails[applicantId].push({ timestamp: new Date().toISOString(), user: 'System', action: 'Credit Check Initiated' });
    mockAuditTrails[applicantId].push({ timestamp: new Date().toISOString(), user: 'System', action: `Credit Report Received (Score: ${report.score})` });
  }
  return report;
};

export const getCreditReport = async (applicantId) => {
  await simulateDelay();
  return mockCreditReports[applicantId];
};

export const getApplicationAuditTrail = async (appId) => {
  await simulateDelay();
  return mockAuditTrails[appId] || [];
};

export const simulateAutomatedDecision = async (applicationId) => {
  await simulateDelay(1500);
  const application = mockApplications.find(app => app.id === applicationId);
  if (!application) {
    throw new Error('Application not found for decision processing.');
  }

  const random = Math.random();
  let decision = 'Escalated';
  let reason = 'Automated rules inconclusive, requires manual review.';

  if (random < 0.4) {
    decision = 'Approved';
    reason = null;
    application.status = 'Approved / Rejected';
    application.decision = 'Approved';
  } else if (random < 0.7) {
    decision = 'Rejected';
    reason = 'Applicant did not meet minimum income requirements.';
    application.status = 'Approved / Rejected';
    application.decision = 'Rejected';
    application.rejectionReason = reason;
  } else {
    application.status = 'Decision Pending';
    application.decision = null;
  }

  mockAuditTrails[applicationId].push({ timestamp: new Date().toISOString(), user: 'System', action: `Automated Decision: ${decision}` });
  return { decision, rejectionReason: reason, escalationReason: reason };
};

export const simulateComplianceCheck = async (applicationId) => {
  await simulateDelay(1000);
  const application = mockApplications.find(app => app.id === applicationId);
  if (!application) {
    throw new Error('Application not found for compliance check.');
  }

  const isCompliant = Math.random() > 0.3; // 70% chance of being compliant
  const reasons = [];
  if (!isCompliant) {
    if (Math.random() < 0.5) reasons.push('Failed AML check (mock).');
    if (Math.random() < 0.5) reasons.push('Missing regulatory consent form (mock).');
    if (reasons.length === 0) reasons.push('General compliance rule violation (mock).');
  }

  mockAuditTrails[applicationId].push({ timestamp: new Date().toISOString(), user: 'System', action: `Compliance Check: ${isCompliant ? 'Passed' : 'Failed'}` });
  return { isCompliant, reasons };
};

export const simulateCustomerNotification = async (contact) => {
  await simulateDelay(500);
  if (Math.random() < 0.1) {
    return { success: false, message: 'Delivery failed: Recipient unreachable.' };
  }
  return { success: true, message: `Notification sent to ${contact}.` };
};

export const simulateEmployeeReminder = async (employeeId) => {
  await simulateDelay(500);
  const pendingTasks = mockEmployeeTasks[employeeId];
  if (!pendingTasks || pendingTasks.length === 0) {
    return { success: true, message: 'No pending tasks for this employee, no reminder sent.' };
  }
  return { success: true, message: `Reminder sent to ${employeeId} for ${pendingTasks.length} pending tasks.` };
};

export const getApplicationReports = async (type, dateRange) => {
  await simulateDelay(1500);
  return { data: mockReports[type][dateRange] || [] };
};

export const getCustomerSatisfactionMetrics = async () => {
  await simulateDelay(1000);
  const totalSurveys = Math.floor(Math.random() * 200);
  if (totalSurveys < 10) {
    return { totalSurveys: 0, averageScore: 0, recentComments: [] };
  }
  const averageScore = parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)); // Score between 3 and 5
  return {
    totalSurveys: totalSurveys,
    averageScore: averageScore,
    recentComments: mockCSAT.recentComments.slice(0, Math.min(totalSurveys, 3)),
  };
};