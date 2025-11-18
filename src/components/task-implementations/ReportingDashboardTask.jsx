import React, { useState, useEffect } from 'react';
import ChartCard from '../ui/ChartCard';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import { mockReportingData } from '../../lib/api/mockApi';

const ReportingDashboardTask = ({ task }) => {
  const showToast = useToast();
  const [reportData, setReportData] = useState({
    totalApplications: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const chartColors = ['var(--color-primary)', 'var(--color-success)', 'var(--color-error)', 'var(--color-warning)'];

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const data = await mockReportingData();
      setReportData(data);
      showToast('Reporting data updated.', 'info');
    } catch (error) {
      showToast(`Failed to fetch report data: ${error.message}`, 'error');
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    showToast('Mock: Generating and exporting report as PDF/CSV...', 'info');
    console.log('Mock: Report data ready for export:', reportData);
  };

  const dashboardChartData = [
    { name: 'Total', value: reportData.totalApplications },
    { name: 'Approved', value: reportData.approved },
    { name: 'Rejected', value: reportData.rejected },
    { name: 'Pending', value: reportData.pending },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-l)' }}>
      <h5>{task.title}</h5>
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-small)', marginBottom: 'var(--spacing-s)' }}>
        Overview of loan application trends and system performance.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-l)' }}>
        <ChartCard
          title="Application Overview"
          type="bar"
          data={[
            { category: 'Total', value: reportData.totalApplications, fill: chartColors[0] },
            { category: 'Approved', value: reportData.approved, fill: chartColors[1] },
            { category: 'Rejected', value: reportData.rejected, fill: chartColors[2] },
            { category: 'Pending', value: reportData.pending, fill: chartColors[3] },
          ]}
          dataKeyX="category"
          dataKeyY="value"
          colors={chartColors}
        />
        <div className="chart-card" style={{ gap: 'var(--spacing-s)' }}>
          <h5>Summary Metrics</h5>
          <div className="report-summary-item">
            <strong>Total Applications:</strong> <span>{reportData.totalApplications}</span>
          </div>
          <div className="report-summary-item">
            <strong>Approved:</strong> <span>{reportData.approved}</span>
          </div>
          <div className="report-summary-item">
            <strong>Rejected:</strong> <span>{reportData.rejected}</span>
          </div>
          <div className="report-summary-item">
            <strong>Pending:</strong> <span>{reportData.pending}</span>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: 'var(--spacing-m)', display: 'flex', justifyContent: 'center', gap: 'var(--spacing-m)' }}>
        <Button onClick={fetchReportData} disabled={isLoading} variant="secondary">
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
        <Button onClick={handleExportReport} variant="primary">
          Export Report (Mock)
        </Button>
      </div>
    </div>
  );
};

export default ReportingDashboardTask;