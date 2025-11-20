import React, { useState, useEffect } from 'react';
import { useApplications } from '../../context/ApplicationContext';

const ManualVerification = ({ appId, manualReviewRequired, documents }) => {
  const { updateApplication } = useApplications();
  const [overrideVerification, setOverrideVerification] = useState(false);
  const [verificationComments, setVerificationComments] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    setStatusMessage('');
    setMessageType('');
  }, [appId]);

  const handleManualVerify = (docName) => {
    if (!overrideVerification && !manualReviewRequired) {
      setStatusMessage('Warning: This document was automatically verified. Override is not recommended.');
      setMessageType('warning');
      return;
    }

    const newAuditEntry = {
      timestamp: new Date().toISOString(),
      user: 'Loan Officer',
      action: `Manual verification for ${docName}. Status overridden. Comments: ${verificationComments || 'N/A'}`,
    };

    updateApplication(appId, {
      documents: documents.map(doc =>
        doc.name === docName
          ? { ...doc, status: 'verified', reason: verificationComments || 'Manually verified' }
          : doc
      ),
      manualReviewRequired: false,
      auditTrail: (prevAudit) => [...(prevAudit || []), newAuditEntry],
    });

    setStatusMessage(`Document ${docName} manually verified.`);
    setMessageType('success');
    setVerificationComments('');
  };

  const handleRejection = (docName) => {
    const newAuditEntry = {
      timestamp: new Date().toISOString(),
      user: 'Loan Officer',
      action: `Document ${docName} manually rejected. Comments: ${verificationComments || 'N/A'}`,
    };

    updateApplication(appId, {
      documents: documents.map(doc =>
        doc.name === docName
          ? { ...doc, status: 'rejected', reason: verificationComments || 'Manually rejected' }
          : doc
      ),
      manualReviewRequired: true,
      auditTrail: (prevAudit) => [...(prevAudit || []), newAuditEntry],
    });

    setStatusMessage(`Document ${docName} manually rejected.`);
    setMessageType('error');
    setVerificationComments('');
  };


  return (
    <div className="card">
      <h4>Manual Verification Fallback</h4>
      {statusMessage && <div className={`message-${messageType}`}>{statusMessage}</div>}
      <p>
        {manualReviewRequired
          ? <span className="message-warning">This application requires manual document review.</span>
          : <span className="message-info">Automatic verification was successful, but you can override if needed.</span>}
      </p>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={overrideVerification}
            onChange={(e) => setOverrideVerification(e.target.checked)}
          />
          Enable Manual Override
        </label>
      </div>

      {(overrideVerification || manualReviewRequired) && (
        <>
          <div className="form-group">
            <label htmlFor="comments">Verification Comments</label>
            <textarea
              id="comments"
              value={verificationComments}
              onChange={(e) => setVerificationComments(e.target.value)}
              placeholder="Add comments for manual verification/rejection"
              rows="3"
            ></textarea>
          </div>
          <div className="form-actions" style={{justifyContent: 'flex-start'}}>
            {documents.filter(doc => doc.status !== 'verified').map(doc => (
              <button key={doc.name} onClick={() => handleManualVerify(doc.name)} className="button-gold" style={{marginRight: '10px'}}>
                Manually Verify {doc.name}
              </button>
            ))}
             {documents.filter(doc => doc.status !== 'rejected').map(doc => (
              <button key={`reject-${doc.name}`} onClick={() => handleRejection(doc.name)} className="button-danger">
                Manually Reject {doc.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManualVerification;