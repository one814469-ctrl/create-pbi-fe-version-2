import React from 'react';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const KPIDashboardContent = () => {
  const { applications } = useApplications();
  const { isLoggedIn, checkAuth } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!checkAuth('compliance')) {
      navigate('/login');
    }
  }, [isLoggedIn, checkAuth, navigate]);

  if (!isLoggedIn || applications.length === 0) {
    return (
      <div className="card message-info">
        <p>No data available yet to display KPIs.</p>
      </div>
    );
  }

  const totalApplications = applications.length;
  const approvedApplications = applications.filter(app => app.status === 'approved').length;
  const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
  const approvalRate = totalApplications > 0 ? ((approvedApplications / totalApplications) * 100).toFixed(2) : 0;

  const calculateAverageTurnaroundTime = () => {
    const completedApplications = applications.filter(app => app.status === 'approved' || app.status === 'rejected');
    if (completedApplications.length === 0) return 'N/A';

    let totalDuration = 0;
    completedApplications.forEach(app => {
      const submission = new Date(app.submissionDate);
      const decision = new Date(app.lastUpdated);
      totalDuration += (decision - submission);
    });

    const avgDurationMs = totalDuration / completedApplications.length;
    const avgDurationDays = Math.ceil(avgDurationMs / (1000 * 60 * 60 * 24));
    return `${avgDurationDays} days`;
  };

  const autoProcessingRate = () => {
    const processedWithOCR = applications.filter(app => app.ocrStatus === 'completed').length;
    return totalApplications > 0 ? ((processedWithOCR / totalApplications) * 100).toFixed(2) : 0;
  };

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="value">{totalApplications}</div>
        <div className="label">Total Applications</div>
      </div>
      <div className="kpi-card">
        <div className="value">{approvalRate}%</div>
        <div className="label">Approval Rate</div>
      </div>
      <div className="kpi-card">
        <div className="value">{calculateAverageTurnaroundTime()}</div>
        <div className="label">Avg. Turnaround Time</div>
      </div>
      <div className="kpi-card">
        <div className="value">{autoProcessingRate()}%</div>
        <div className="label">Auto-Processing Rate (OCR)</div>
      </div>
    </div>
  );
};

export default KPIDashboardContent;