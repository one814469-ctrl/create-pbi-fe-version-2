import React, { useState } from 'react';
import { mockReports } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const ReportGenerator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const [reportType, setReportType] = useState('applicationVolume');
  const [dateRange, setDateRange] = useState('2023-01 - 2023-06'); // Mock date range
  const [generatedReport, setGeneratedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || user?.role !== 'manager') {
    displayMessage('error', 'Access denied. You need manager permissions to generate reports.');
    return (
      <p className="error-message">
        Access Denied: Only managers can generate loan application reports.
      </p>
    );
  }

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedReport(null);

    // Simulate report generation time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const data = mockReports[reportType];

    // Acceptance Criteria: [Edge] Given no data for selected period
    if (!data || data.data.length === 0) {
      setGeneratedReport({ type: reportType, data: null, message: 'No data found for the selected period.' });
      displayMessage('info', 'No data found for the report.');
    } else {
      setGeneratedReport({ type: reportType, data: data, message: 'Report generated successfully.' });
      displayMessage('success', 'Report generated.');
    }
    setLoading(false);
  };

  const handleExportReport = () => {
    if (generatedReport && generatedReport.data) {
      const csvContent = "data:text/csv;charset=utf-8,"
        + `${generatedReport.data.labels.join(',')}\n`
        + `${generatedReport.data.data.join(',')}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${reportType}-report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      displayMessage('success', 'Report exported as CSV.');
    } else {
      displayMessage('error', 'No report data to export.');
    }
  };

  return (
    <div className="dashboard-card">
      <h5>Generate Loan Application Processing Report</h5>
      <form onSubmit={handleGenerateReport}>
        <div className="form-group">
          <label htmlFor="reportType">Report Type:</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            disabled={loading}
          >
            <option value="applicationVolume">Application Volume</option>
            <option value="turnaroundTime">Average Turnaround Time</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateRange">Date Range (Mock):</label>
          <input
            type="text"
            id="dateRange"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </form>

      {generatedReport && (
        <div style={{ marginTop: '1.5rem' }}>
          <h6>Generated Report:</h6>
          {generatedReport.data ? (
            <div>
              <p>{generatedReport.message}</p>
              <p><strong>Type:</strong> {generatedReport.type === 'applicationVolume' ? 'Application Volume' : 'Average Turnaround Time'}</p>
              <p><strong>Period:</strong> {dateRange}</p>
              <table className="data-table">
                <thead>
                  <tr>
                    {generatedReport.data.labels.map((label, index) => <th key={index}>{label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {generatedReport.data.data.map((value, index) => <td key={index}>{value}</td>)}
                  </tr>
                </tbody>
              </table>
              <button onClick={handleExportReport} style={{ marginTop: '1rem' }}>Export as CSV</button>
            </div>
          ) : (
            <p className="info-message">{generatedReport.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;