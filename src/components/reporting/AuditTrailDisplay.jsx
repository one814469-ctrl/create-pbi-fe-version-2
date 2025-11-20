import React, { useState, useEffect } from 'react';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuditTrailDisplay = ({ appId }) => {
  const { getApplicationById } = useApplications();
  const { isLoggedIn, userRole, checkAuth } = useAuth();
  const navigate = useNavigate();
  const application = getApplicationById(appId);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!checkAuth('compliance') && userRole !== 'officer') {
      setAccessDenied(true);
    } else {
      setAccessDenied(false);
    }
  }, [isLoggedIn, userRole, checkAuth, navigate]);

  if (!isLoggedIn || accessDenied) {
    return (
      <div className="card message-error">
        <p>Access Denied: Insufficient permissions to view audit logs.</p>
      </div>
    );
  }

  if (!application || !application.auditTrail || application.auditTrail.length === 0) {
    return <div className="message-info">No audit history available for this application.</div>;
  }

  return (
    <div>
      <h4>View Application Audit Trail</h4>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', padding: '1em' }}>
        {application.auditTrail
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map((entry, index) => (
            <div key={index} className="audit-log-entry">
              <span className="timestamp">{new Date(entry.timestamp).toLocaleString()}:</span>
              <span className="action">[{entry.user}] {entry.action}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AuditTrailDisplay;