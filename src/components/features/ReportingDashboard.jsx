import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { useNotification } from '../common/Notification';
import { getApplicationReports, getCustomerSatisfactionMetrics } from '../../utils/api';
import '../../styles/Reporting.css';

function ReportingDashboard() {
  const [reportType, setReportType] = useState('volume');
  const [dateRange, setDateRange] = useState('last30days');
  const [applicationReport, setApplicationReport] = useState(null);
  const [csatMetrics, setCsatMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const fetchReports = async () => {
    setIsLoading(true);
    setApplicationReport(null);
    setCsatMetrics(null);
    try {
      const appReport = await getApplicationReports(reportType, dateRange);
      setApplicationReport(appReport);
      const csatReport = await getCustomerSatisfactionMetrics();
      setCsatMetrics(csatReport);

      if (appReport.data.length === 0) {
        showNotification('No data found for the selected period for application reports.', 'info');
      }
      if (csatReport.averageScore === 0) {
        showNotification('Insufficient survey data for CSAT metrics.', 'warning');
      }
    } catch (error) {
      showNotification(`Failed to load reports: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [reportType, dateRange]);

  const handleExportReport = () => {
    if (applicationReport && applicationReport.data.length > 0) {
      const dataStr = JSON.stringify(applicationReport.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${dateRange}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('Report exported successfully!', 'success');
    } else {
      showNotification('No data to export.', 'warning');
    }
  };

  return (
    <div className="reporting-dashboard-container">
      <Card title="Application Volume & Turnaround Reports">
        <p>As a manager, I want to view and export reports on the number of applications and average turnaround times so that I can monitor operational efficiency.</p>
        <div className="report-controls">
          <div className="input-group">
            <label htmlFor="report-type">Report Type:</label>
            <select id="report-type" value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="volume">Volume</option>
              <option value="turnaround">Turnaround Time</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="date-range">Date Range:</label>
            <select id="date-range" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
            </select>
          </div>
          <Button onClick={fetchReports} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
          <Button onClick={handleExportReport} disabled={!applicationReport || applicationReport.data.length === 0} variant="secondary">
            Export Report
          </Button>
        </div>

        {applicationReport && (
          <div className="report-display card">
            <h4>{reportType === 'volume' ? 'Application Volume' : 'Average Turnaround Time'} for {dateRange}</h4>
            {applicationReport.data.length > 0 ? (
              <div className="report-graph-mock">
                <p>Mock Graph/Chart for {reportType} (visual representation not fully implemented)</p>
                {applicationReport.data.map((item, index) => (
                  <div key={index} className="report-item">
                    <span>{item.period}: </span>
                    <span>{item.value} {reportType === 'volume' ? 'Applications' : 'Days'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No data available for this report and period.</p>
            )}
          </div>
        )}
      </Card>

      <Card title="Customer Satisfaction Tracking">
        <p>As a manager, I want to see trends in customer satisfaction surveys so that I can assess and improve service quality.</p>
        <Button onClick={fetchReports} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh CSAT Metrics'}
        </Button>

        {csatMetrics && (
          <div className="csat-display card">
            <h4>Aggregated Customer Satisfaction Metrics</h4>
            {csatMetrics.totalSurveys > 0 ? (
              <>
                <p><strong>Total Surveys:</strong> {csatMetrics.totalSurveys}</p>
                <p><strong>Average CSAT Score:</strong> <span className={`score-${csatMetrics.averageScore >= 4 ? 'good' : 'bad'}`}>{csatMetrics.averageScore.toFixed(1)} / 5</span></p>
                <h5>Recent Comments:</h5>
                {csatMetrics.recentComments.length > 0 ? (
                  <ul>
                    {csatMetrics.recentComments.map((comment, index) => (
                      <li key={index}>"{comment}"</li>
                    ))}
                  </ul>
                ) : (
                  <p>No recent comments.</p>
                )}
                <p className="csat-trend-mock">Mock trend visualization for CSAT over time.</p>
              </>
            ) : (
              <p className="warning-message">Insufficient survey data. Cannot display meaningful metrics.</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default ReportingDashboard;