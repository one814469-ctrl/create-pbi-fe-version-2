import React, { useState } from 'react';
import { mockReports } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const ReportGenerator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const [reportType, setReportType] = useState('applicationVolume');
  const [dateRange, setDateRange] = useState('2023-01 - 2023-06');
  const [generatedReport, setGeneratedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || user?.role !== 'manager') {
    displayMessage('error', 'Access Denied', 'You need manager permissions to generate reports.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Application Volume & Turnaround Reports</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only managers can generate loan application reports.</p>
        </div>
      </div>
    );
  }

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedReport(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const data = mockReports[reportType];

    if (!data || data.data.length === 0) {
      setGeneratedReport({ type: reportType, data: null, message: 'No data found for the selected period.' });
      displayMessage('info', 'Report Info', 'No data found for the report.');
    } else {
      setGeneratedReport({ type: reportType, data: data, message: 'Report generated successfully.' });
      displayMessage('success', 'Report Generated', 'Report generated successfully.');
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
      displayMessage('success', 'Export Successful', 'Report exported as CSV.');
    } else {
      displayMessage('error', 'Export Failed', 'No report data to export.');
    }
  };

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">Generate Loan Application Processing Report</h3>
        <p className="card-description">View and export statistics on loan volume and processing speed.</p>
      </div>
      <div className="card-content space-y-6">
        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reportType" className="block text-sm font-medium">Report Type</label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              disabled={loading}
              className="w-full"
            >
              <option value="applicationVolume">Application Volume</option>
              <option value="turnaroundTime">Average Turnaround Time</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="dateRange" className="block text-sm font-medium">Date Range (Mock)</label>
            <input
              id="dateRange"
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              disabled={loading}
              readOnly
              className="w-full"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </form>

        {generatedReport && (
          <div className="space-y-4">
            <h6 className="text-lg font-semibold">Generated Report:</h6>
            {generatedReport.data ? (
              <div className="space-y-2">
                <p className="text-muted-foreground">{generatedReport.message}</p>
                <p><strong>Type:</strong> {generatedReport.type === 'applicationVolume' ? 'Application Volume' : 'Average Turnaround Time'}</p>
                <p><strong>Period:</strong> {dateRange}</p>
                <div className="rounded-md border overflow-hidden">
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
                </div>
                <button onClick={handleExportReport} className="mt-4">Export as CSV</button>
              </div>
            ) : (
              <p className="text-muted-foreground italic">{generatedReport.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;