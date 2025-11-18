import React, { useState, useEffect } from 'react';

const ReportDashboardTask = ({ task }) => {
  const [reportData, setReportData] = useState({
    totalApplications: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });

  useEffect(() => {
    // Simulate fetching data for the report
    const fetchData = () => {
      const total = 120;
      const approved = 85;
      const rejected = 20;
      const pending = total - approved - rejected;
      setReportData({
        totalApplications: total,
        approved: approved,
        rejected: rejected,
        pending: pending
      });
    };
    fetchData();
  }, []);

  const maxVal = Math.max(reportData.totalApplications, reportData.approved, reportData.rejected, reportData.pending);

  const handleExportReport = () => {
    alert('Mock: Generating and exporting report as PDF/CSV...');
    console.log('Mock: Report data ready for export:', reportData);
  };

  return (
    <div className="report-chart-container">
      <h5>{task.title}</h5>

      <div className="report-summary">
        <div className="report-item">
          <span>Total Applications Submitted:</span>
          <span>{reportData.totalApplications}</span>
        </div>
        <div className="report-item">
          <span>Approved Applications:</span>
          <span>{reportData.approved}</span>
        </div>
        <div className="report-item">
          <span>Rejected Applications:</span>
          <span>{reportData.rejected}</span>
        </div>
        <div className="report-item">
          <span>Pending Applications:</span>
          <span>{reportData.pending}</span>
        </div>
      </div>

      <div className="chart-bar-container">
        {maxVal > 0 && (
          <>
            <div
              className="chart-bar total"
              style={{ height: `${(reportData.totalApplications / maxVal) * 100}%` }}
              title={`Total: ${reportData.totalApplications}`}
            >
              {reportData.totalApplications}
              <span className="chart-bar-label">Total</span>
            </div>
            <div
              className="chart-bar approved"
              style={{ height: `${(reportData.approved / maxVal) * 100}%` }}
              title={`Approved: ${reportData.approved}`}
            >
              {reportData.approved}
              <span className="chart-bar-label">Approved</span>
            </div>
            <div
              className="chart-bar rejected"
              style={{ height: `${(reportData.rejected / maxVal) * 100}%` }}
              title={`Rejected: ${reportData.rejected}`}
            >
              {reportData.rejected}
              <span className="chart-bar-label">Rejected</span>
            </div>
            <div
              className="chart-bar pending"
              style={{ height: `${(reportData.pending / maxVal) * 100}%` }}
              title={`Pending: ${reportData.pending}`}
            >
              {reportData.pending}
              <span className="chart-bar-label">Pending</span>
            </div>
          </>
        )}
      </div>
      <button onClick={handleExportReport} style={{marginTop: '30px'}}>Export Report (Mock)</button>
    </div>
  );
};

export default ReportDashboardTask;