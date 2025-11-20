import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import OCRProcessor from './OCRProcessor';
import ManualVerification from './ManualVerification';
import CreditCheckWidget from '../integration/CreditCheckWidget';
import CoreBankingSubmissionWidget from '../integration/CoreBankingSubmissionWidget';
import AuditTrailDisplay from '../reporting/AuditTrailDisplay';

const ApplicationDetailView = () => {
  const { id } = useParams();
  const { applications, getApplicationById, updateApplication, simulateDecisionNotification } = useApplications();
  const { isLoggedIn, userRole, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (!checkAuth('officer')) {
      navigate('/login');
    }
  }, [isLoggedIn, checkAuth, navigate]);

  useEffect(() => {
    if (id) {
      setApplication(getApplicationById(id));
    }
  }, [id, applications, getApplicationById]);

  if (!isLoggedIn || userRole !== 'officer') return null;

  if (!application) {
    return <div className="card message-error"><p>Application not found.</p></div>;
  }

  const handleStatusChange = (newStatus) => {
    const newAuditEntry = {
      timestamp: new Date().toISOString(),
      user: `Loan Officer (${userRole})`,
      action: `Application status changed to ${newStatus.toUpperCase()}`,
    };
    updateApplication(application.id, { status: newStatus, auditTrail: [...application.auditTrail, newAuditEntry] });
    simulateDecisionNotification(application.id, newStatus);
  };

  return (
    <div>
      <h2 className="page-title">Application Details: {application.applicantName} ({application.id})</h2>

      <div className="card">
        <h3>General Information</h3>
        <div className="detail-section">
          <div className="detail-item"><strong>Applicant Name:</strong> {application.applicantName}</div>
          <div className="detail-item"><strong>Email:</strong> {application.email}</div>
          <div className="detail-item"><strong>Phone:</strong> {application.phone || 'N/A'}</div>
          <div className="detail-item"><strong>Loan Type:</strong> {application.loanType}</div>
          <div className="detail-item"><strong>Loan Amount:</strong> ${application.loanAmount.toLocaleString()}</div>
          <div className="detail-item">
            <strong>Current Status:</strong>
            <span className={`status-badge ${application.status}`} style={{ marginLeft: '10px' }}>
              {application.status.replace('-', ' ')}
            </span>
          </div>
          <div className="detail-item"><strong>Submission Date:</strong> {new Date(application.submissionDate).toLocaleString()}</div>
          <div className="detail-item"><strong>Last Updated:</strong> {new Date(application.lastUpdated).toLocaleString()}</div>
        </div>

        <div className="detail-section">
          <h4>Actions</h4>
          <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
            <button onClick={() => handleStatusChange('approved')} disabled={application.status === 'approved'} className="button-success">Approve</button>
            <button onClick={() => handleStatusChange('rejected')} disabled={application.status === 'rejected'} className="button-danger">Reject</button>
            <button onClick={() => handleStatusChange('under-review')} disabled={application.status === 'under-review'} className="button-info">Move to Under Review</button>
            <button onClick={() => handleStatusChange('pending-documents')} disabled={application.status === 'pending-documents'} className="button-warning">Request More Docs</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Documents and Verification</h3>
        <OCRProcessor appId={application.id} ocrStatus={application.ocrStatus} />
        {application.documents.length > 0 ? (
          <div className="detail-section">
            <h5>Uploaded Documents</h5>
            <ul className="document-list">
              {application.documents.map((doc, index) => (
                <li key={index}>
                  <div>
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ marginRight: '10px' }}>{doc.name}</a>
                    <span className={`status-badge ${doc.status}`}>{doc.status.replace('-', ' ')}</span>
                    {doc.reason && <span className="message-error" style={{marginLeft: '1em'}}>{doc.reason}</span>}
                  </div>
                  {doc.extractedData && (
                    <span style={{ fontSize: '0.9em', color: var('--color-muted') }}>
                      (OCR: {doc.extractedData.ocr || 'Not run'})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="message-info">No documents uploaded yet.</p>
        )}
        <ManualVerification appId={application.id} manualReviewRequired={application.manualReviewRequired} documents={application.documents} />
      </div>

      <div className="card">
        <h3>External Integrations</h3>
        <CreditCheckWidget appId={application.id} creditScore={application.creditScore} creditReport={application.creditReport} />
        {application.status === 'approved' && (
          <CoreBankingSubmissionWidget appId={application.id} />
        )}
      </div>

      <div className="card">
        <h3>Audit Trail</h3>
        <AuditTrailDisplay appId={application.id} />
      </div>
    </div>
  );
};

export default ApplicationDetailView;