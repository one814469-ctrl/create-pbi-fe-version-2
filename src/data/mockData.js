export const mockApplications = [
  {
    id: 'APP001',
    fullName: 'Alice Smith',
    email: 'alice.s@example.com',
    phone: '555-111-2222',
    address: '123 Main St, Anytown',
    loanAmount: 50000,
    loanPurpose: 'Home Renovation',
    income: 75000,
    employmentStatus: 'Employed',
    status: 'Approved / Rejected',
    decision: 'Approved',
    rejectionReason: null,
    creditChecked: true,
  },
  {
    id: 'APP002',
    fullName: 'Bob Johnson',
    email: 'bob.j@example.com',
    phone: '555-333-4444',
    address: '456 Oak Ave, Otherville',
    loanAmount: 20000,
    loanPurpose: 'Car Purchase',
    income: 45000,
    employmentStatus: 'Employed',
    status: 'Documents Under Review',
    decision: null,
    rejectionReason: null,
    creditChecked: false,
  },
  {
    id: 'APP003',
    fullName: 'Charlie Brown',
    email: 'charlie.b@example.com',
    phone: '555-555-6666',
    address: '789 Pine Ln, Somewhere',
    loanAmount: 10000,
    loanPurpose: 'Debt Consolidation',
    income: 30000,
    employmentStatus: 'Self-Employed',
    status: 'Approved / Rejected',
    decision: 'Rejected',
    rejectionReason: 'Low credit score and unstable income.',
    creditChecked: true,
  },
  {
    id: 'APP004',
    fullName: 'Diana Prince',
    email: 'diana.p@example.com',
    phone: '555-777-8888',
    address: '101 Hero Blvd, Themyscira',
    loanAmount: 100000,
    loanPurpose: 'Business Expansion',
    income: 120000,
    employmentStatus: 'Employed',
    status: 'Decision Pending',
    decision: null,
    rejectionReason: null,
    creditChecked: true,
  },
];

export const mockCreditReports = {
  'APP001': { score: 720, summary: 'Excellent credit history, low debt-to-income ratio.', flags: [] },
  'APP003': { score: 580, summary: 'Fair credit history, recent late payments, high credit utilization.', flags: ['High Credit Utilization', 'Recent Late Payments'] },
  'APP004': { score: 680, summary: 'Good credit history, stable income, some inquiries.', flags: [] },
};

export const mockAuditTrails = {
  'APP001': [
    { timestamp: new Date('2023-01-01T10:00:00Z'), user: 'System', action: 'Application Submitted' },
    { timestamp: new Date('2023-01-02T11:00:00Z'), user: 'System', action: 'Documents Verified' },
    { timestamp: new Date('2023-01-03T12:00:00Z'), user: 'System', action: 'Credit Check Initiated' },
    { timestamp: new Date('2023-01-03T12:05:00Z'), user: 'System', action: 'Credit Report Received (Score: 720)' },
    { timestamp: new Date('2023-01-04T13:00:00Z'), user: 'System', action: 'Automated Decision: Approved' },
  ],
  'APP002': [
    { timestamp: new Date('2023-02-01T09:30:00Z'), user: 'System', action: 'Application Submitted' },
    { timestamp: new Date('2023-02-02T10:30:00Z'), user: 'LO001', action: 'Documents review initiated' },
  ],
  'APP003': [
    { timestamp: new Date('2023-03-01T14:00:00Z'), user: 'System', action: 'Application Submitted' },
    { timestamp: new Date('2023-03-02T15:00:00Z'), user: 'System', action: 'Documents Verified' },
    { timestamp: new Date('2023-03-03T16:00:00Z'), user: 'System', action: 'Credit Check Initiated' },
    { timestamp: new Date('2023-03-03T16:05:00Z'), user: 'System', action: 'Credit Report Received (Score: 580)' },
    { timestamp: new Date('2023-03-04T17:00:00Z'), user: 'System', action: 'Automated Decision: Rejected (Low credit score)' },
  ],
  'APP004': [
    { timestamp: new Date('2023-04-01T11:00:00Z'), user: 'System', action: 'Application Submitted' },
    { timestamp: new Date('2023-04-02T12:00:00Z'), user: 'System', action: 'Documents Verified' },
    { timestamp: new Date('2023-04-03T13:00:00Z'), user: 'System', action: 'Credit Check Initiated' },
    { timestamp: new Date('2023-04-03T13:05:00Z'), user: 'System', action: 'Credit Report Received (Score: 680)' },
    { timestamp: new Date('2023-04-04T14:00:00Z'), user: 'System', action: 'Compliance Check Passed' },
    { timestamp: new Date('2023-04-05T15:00:00Z'), user: 'System', action: 'Decision Pending (Automated rules inconclusive)' },
  ],
};

export const mockOCRData = {
  name: 'John Doe',
  idNumber: '123-456-789',
  income: '$60,000',
};

export const mockDocumentVerification = {
  status: 'pending', // 'pending', 'verified', 'failed'
  reason: null,
};

export const mockComplianceRules = {
  minCreditScore: 600,
  maxDebtToIncomeRatio: 0.4,
  requiredDocuments: ['ID', 'Proof of Income'],
};

export const mockCustomerNotifications = [
  'customer@example.com',
  '+1234567890',
];

export const mockEmployeeTasks = {
  'LO001': ['Review APP002 documents', 'Approve APP004 decision'],
  'UW001': ['Verify APP005 compliance'],
};

export const mockReports = {
  volume: {
    last7days: [{ period: 'Day 1', value: 5 }, { period: 'Day 2', value: 8 }, { period: 'Day 3', value: 3 }, { period: 'Day 4', value: 10 }, { period: 'Day 5', value: 7 }, { period: 'Day 6', value: 6 }, { period: 'Day 7', value: 9 }],
    last30days: [{ period: 'Week 1', value: 30 }, { period: 'Week 2', value: 25 }, { period: 'Week 3', value: 35 }, { period: 'Week 4', value: 40 }],
    last90days: [{ period: 'Month 1', value: 120 }, { period: 'Month 2', value: 110 }, { period: 'Month 3', value: 130 }],
  },
  turnaround: {
    last7days: [{ period: 'Day 1', value: 2.1 }, { period: 'Day 2', value: 1.8 }, { period: 'Day 3', value: 2.5 }, { period: 'Day 4', value: 1.5 }, { period: 'Day 5', value: 2.0 }, { period: 'Day 6', value: 2.2 }, { period: 'Day 7', value: 1.9 }],
    last30days: [{ period: 'Week 1', value: 2.3 }, { period: 'Week 2', value: 2.1 }, { period: 'Week 3', value: 2.4 }, { period: 'Week 4', value: 2.0 }],
    last90days: [{ period: 'Month 1', value: 2.5 }, { period: 'Month 2', value: 2.3 }, { period: 'Month 3', value: 2.1 }],
  },
};

export const mockCSAT = {
  totalSurveys: 150,
  averageScore: 4.2,
  recentComments: [
    'Very smooth application process!',
    'Wish the document upload was faster.',
    'Excellent customer service.',
    'Clear status updates were helpful.',
    'Needed more clarity on credit check results.',
  ],
};