export const mockUsers = [
  { username: 'john.doe@fintrust.com', password: 'password123', role: 'customer', customerID: 'CUST001' },
  { username: 'jane.smith@fintrust.com', password: 'password123', role: 'customer', customerID: 'CUST002' },
  { username: 'loan.officer@fintrust.com', password: 'password123', role: 'officer' },
  { username: 'underwriter@fintrust.com', password: 'password123', role: 'underwriter' },
  { username: 'manager@fintrust.com', password: 'password123', role: 'manager' },
];

export const mockLoanApplications = [
  {
    id: 'LA001',
    customerName: 'John Doe',
    customerID: 'CUST001',
    type: 'Personal Loan',
    amount: 15000,
    status: 'Pending Document Review',
    submittedDate: '2023-01-15',
    documents: [],
    ocrExtractedData: null,
    documentVerificationStatus: 'Pending',
    creditScore: null,
    creditReport: null,
    creditCheckStatus: 'Pending',
    approvalStatus: 'Pending',
    complianceStatus: 'Pending',
    auditTrail: [
      { timestamp: '2023-01-15T10:00:00Z', user: 'system', action: 'Application Submitted' }
    ]
  },
  {
    id: 'LA002',
    customerName: 'Jane Smith',
    customerID: 'CUST002',
    type: 'Mortgage Loan',
    amount: 250000,
    status: 'Approved',
    submittedDate: '2023-01-10',
    documents: ['Passport.pdf', 'Paystub.pdf'],
    ocrExtractedData: { name: 'Jane Smith', id: 'ID12345', income: 85000 },
    documentVerificationStatus: 'Verified',
    creditScore: 780,
    creditReport: 'Excellent credit history',
    creditCheckStatus: 'Completed',
    approvalStatus: 'Approved',
    complianceStatus: 'Compliant',
    auditTrail: [
      { timestamp: '2023-01-10T09:00:00Z', user: 'system', action: 'Application Submitted' },
      { timestamp: '2023-01-11T14:30:00Z', user: 'system', action: 'Documents Uploaded & OCR Processed' },
      { timestamp: '2023-01-11T15:00:00Z', user: 'system', action: 'Credit Check Initiated' },
      { timestamp: '2023-01-11T15:05:00Z', user: 'system', action: 'Credit Score: 780' },
      { timestamp: '2023-01-12T10:00:00Z', user: 'system', action: 'Automated Compliance Check Passed' },
      { timestamp: '2023-01-12T10:10:00Z', user: 'system', action: 'Application Auto-Approved' },
      { timestamp: '2023-01-12T10:15:00Z', user: 'system', action: 'Applicant Notified of Approval' }
    ]
  },
  {
    id: 'LA003',
    customerName: 'Peter Jones',
    customerID: 'CUST003',
    type: 'Auto Loan',
    amount: 30000,
    status: 'Documents Required',
    submittedDate: '2023-01-18',
    documents: [],
    ocrExtractedData: null,
    documentVerificationStatus: 'Pending',
    creditScore: null,
    creditReport: null,
    creditCheckStatus: 'Pending',
    approvalStatus: 'Pending',
    complianceStatus: 'Pending',
    auditTrail: [
      { timestamp: '2023-01-18T11:00:00Z', user: 'system', action: 'Application Submitted' }
    ]
  },
  {
    id: 'LA004',
    customerName: 'Alice Brown',
    customerID: 'CUST004',
    type: 'Personal Loan',
    amount: 5000,
    status: 'Rejected',
    submittedDate: '2023-01-20',
    documents: ['IDCard.pdf'],
    ocrExtractedData: { name: 'Alice Brown', id: 'ID98765', income: 30000 },
    documentVerificationStatus: 'Verified',
    creditScore: 550,
    creditReport: 'Poor credit history, multiple recent delinquencies',
    creditCheckStatus: 'Completed',
    approvalStatus: 'Rejected',
    complianceStatus: 'Compliant',
    auditTrail: [
      { timestamp: '2023-01-20T13:00:00Z', user: 'system', action: 'Application Submitted' },
      { timestamp: '2023-01-20T14:00:00Z', user: 'system', action: 'Documents Uploaded & OCR Processed' },
      { timestamp: '2023-01-20T14:15:00Z', user: 'system', action: 'Credit Check Initiated' },
      { timestamp: '2023-01-20T14:20:00Z', user: 'system', action: 'Credit Score: 550' },
      { timestamp: '2023-01-20T15:00:00Z', user: 'system', action: 'Application Auto-Rejected: Credit Score Below Threshold' },
      { timestamp: '2023-01-20T15:05:00Z', user: 'system', action: 'Applicant Notified of Rejection' }
    ]
  }
];

export const mockNotifications = [
  { id: 'N001', userId: 'CUST001', type: 'status_update', message: 'Your application LA001 status changed to Pending Document Review.', read: false, timestamp: '2023-01-15T10:05:00Z' },
  { id: 'N002', userId: 'CUST002', type: 'status_update', message: 'Congratulations! Your application LA002 has been Approved.', read: false, timestamp: '2023-01-12T10:15:00Z' },
  { id: 'N003', userId: 'CUST004', type: 'status_update', message: 'Your application LA004 has been Rejected. Reason: Credit Score Below Threshold.', read: true, timestamp: '2023-01-20T15:05:00Z' },
  { id: 'N004', userId: 'officer_tasks', type: 'reminder', message: 'Reminder: Application LA001 requires document review.', read: false, timestamp: '2023-01-16T09:00:00Z' }
];

export const mockReports = {
  applicationVolume: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [150, 180, 220, 190, 250, 210]
  },
  turnaroundTime: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [7, 6, 5, 6, 4, 5]
  },
  csatScores: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    data: [3.8, 4.1, 4.0, 4.2],
    comments: [
      { id: 1, text: "Smooth application process.", score: 5 },
      { id: 2, text: "Document upload was a bit clunky.", score: 3 },
      { id: 3, text: "Quick approval, very satisfied.", score: 5 }
    ]
  }
};