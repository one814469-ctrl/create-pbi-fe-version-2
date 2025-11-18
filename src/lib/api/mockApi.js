// src/lib/api/mockApi.js

const MOCK_LATENCY = 1000; // 1 second delay for mock API calls
const MOCK_ERROR_RATE = 0.1; // 10% chance of a mock API call failing

/**
 * Simulates an asynchronous API call.
 * @param {any} data - The data to be returned on success.
 * @param {string} errorReason - The error message on failure.
 * @returns {Promise<any>} A promise that resolves with data or rejects with an error.
 */
export const mockApiCall = (data, errorReason = 'Mock API Error') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > MOCK_ERROR_RATE) {
        resolve(data);
      } else {
        reject(new Error(errorReason));
      }
    }, MOCK_LATENCY);
  });
};

/**
 * Simulates an OCR service call.
 * @param {File} file - The file to be "processed".
 * @returns {Promise<{status: string, data?: any, error?: string, requiresReupload?: boolean}>}
 */
export const mockOcrService = (file) => {
  console.log(`Mock OCR: Processing file ${file.name}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% chance of success
      if (isSuccess) {
        resolve({
          status: 'verified',
          data: {
            extractedText: `Mock OCR for ${file.name}: Name: Jane Doe, DOB: 01/01/1990`,
            verification: 'Passed'
          }
        });
      } else {
        const requiresReupload = Math.random() > 0.5; // 50% chance to require re-upload on rejection
        reject({
          status: 'rejected',
          error: 'Document unclear or data mismatch. Needs manual review.',
          requiresReupload: requiresReupload
        });
      }
    }, MOCK_LATENCY * 2); // Longer latency for OCR
  });
};

/**
 * Simulates a Credit Bureau API call.
 * @param {string} applicantId - The ID of the applicant.
 * @returns {Promise<{creditScore: number, creditRating: string, reportSummary: string}>}
 */
export const mockCreditBureauApi = (applicantId) => {
  console.log(`Mock Credit Bureau: Fetching score for applicant ${applicantId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% chance of success
      if (isSuccess) {
        const score = Math.floor(Math.random() * (850 - 600 + 1)) + 600; // Score between 600-850
        let rating = 'Fair';
        if (score >= 700) rating = 'Good';
        if (score >= 750) rating = 'Excellent';

        resolve({
          creditScore: score,
          creditRating: rating,
          reportSummary: `Credit score: ${score}. Report summary: Good payment history, few inquiries.`
        });
      } else {
        reject(new Error('Credit Bureau API unavailable or applicant data mismatch.'));
      }
    }, MOCK_LATENCY * 1.5); // Medium latency for credit check
  });
};

/**
 * Simulates sending notifications (email/SMS).
 * @param {string} recipient - Recipient identifier.
 * @param {string} subject - Notification subject.
 * @param {string} body - Notification body.
 * @param {string} type - 'email' or 'sms'.
 * @returns {Promise<{status: string, message: string}>}
 */
export const mockNotificationService = (recipient, subject, body, type) => {
  console.log(`Mock Notification: Sending ${type} to ${recipient} with subject "${subject}"`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.05; // 95% chance of success
      if (isSuccess) {
        resolve({ status: 'success', message: `${type} sent successfully to ${recipient}.` });
      } else {
        reject(new Error(`Failed to send ${type} to ${recipient}.`));
      }
    }, MOCK_LATENCY / 2); // Quick latency for notifications
  });
};

/**
 * Simulates fetching reporting data.
 * @returns {Promise<{totalApplications: number, approved: number, rejected: number, pending: number}>}
 */
export const mockReportingData = () => {
  console.log('Mock Reporting: Fetching dashboard data.');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.05) { // 95% chance of success
        const total = 120 + Math.floor(Math.random() * 30); // Simulate some fluctuation
        const approved = Math.floor(total * (0.6 + Math.random() * 0.2)); // 60-80% approved
        const rejected = Math.floor(total * (0.1 + Math.random() * 0.1)); // 10-20% rejected
        const pending = total - approved - rejected;
        resolve({
          totalApplications: total,
          approved: approved,
          rejected: rejected,
          pending: Math.max(0, pending) // Ensure pending is not negative
        });
      } else {
        reject(new Error('Failed to retrieve reporting data.'));
      }
    }, MOCK_LATENCY);
  });
};