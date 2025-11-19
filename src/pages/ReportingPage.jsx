import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ReportingPage = ({ epics }) => {
  const reportingEpic = epics.find(epic => epic.title === "Reporting & Analytics");
  const volumeReportStory = reportingEpic?.userStories.find(story => story.title === "Application Volume & Turnaround Reports");
  const csatStory = reportingEpic?.userStories.find(story => story.title === "Customer Satisfaction Tracking");

  const [dateRange, setDateRange] = useState('monthly');
  const [reportType, setReportType] = useState('volume');
  const [reportData, setReportData] = useState(null);
  const [csatData, setCsatData] = useState(null);

  const generateReport = () => {
    // Simulate data generation
    setReportData(null);
    setCsatData(null);

    if (reportType === 'volume') {
      const dataExists = Math.random() > 0.1; // 90% chance of data
      if (dataExists) {
        setReportData({
          period: dateRange,
          totalApplications: Math.floor(Math.random() * 500) + 100,
          approved: Math.floor(Math.random() * 300) + 50,
          rejected: Math.floor(Math.random() * 100) + 20,
          avgTurnaroundDays: (Math.random() * 10 + 3).toFixed(1),
          reportDate: new Date().toLocaleDateString()
        });
      } else {
        setReportData('no-data');
      }
    } else if (reportType === 'csat') {
      const dataExists = Math.random() > 0.1; // 90% chance of data
      if (dataExists) {
        const totalSurveys = Math.floor(Math.random() * 200) + 50;
        const insufficientData = totalSurveys < 30 && Math.random() > 0.5; // Simulate insufficient data sometimes
        if (insufficientData) {
          setCsatData('insufficient-data');
        } else {
          setCsatData({
            period: dateRange,
            averageScore: (Math.random() * (5 - 3.5) + 3.5).toFixed(2),
            totalSurveys: totalSurveys,
            comments: [
              "Great service, very quick approval!",
              "Application process was smooth.",
              "Needed more clarity on document requirements.",
              "Satisfied with the loan terms."
            ],
            reportDate: new Date().toLocaleDateString()
          });
        }
      } else {
        setCsatData('no-data');
      }
    }
  };

  const exportReport = () => {
    if (reportData || csatData) {
      alert('Simulating report export to CSV/PDF!');
      console.log('Exporting report:', reportData || csatData);
    }
  };

  const getVolumeReportTask = volumeReportStory?.tasks[0];
  const getCsatTask = csatStory?.tasks[0];

  return (
    <div>
      <h1>Reporting & Analytics Dashboard</h1>
      <p>{reportingEpic?.description}</p>

      <div className="dashboard-grid">
        {volumeReportStory && (
          <Card>
            <h3>{volumeReportStory.title}</h3>
            <p>{volumeReportStory.description}</p>
            <div className="form-group">
              <label htmlFor="reportDateRange">Date Range:</label>
              <select id="reportDateRange" value={dateRange} onChange={(e) => setDateRange(e.target.value)}
                      className="form-input">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reportType">Report Type:</label>
              <select id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)}
                      className="form-input">
                <option value="volume">Application Volume & Turnaround</option>
                <option value="csat">Customer Satisfaction</option>
              </select>
            </div>
            <Button onClick={generateReport} className="button-primary mr-2">Generate Report</Button>
            <Button onClick={exportReport} disabled={!reportData && !csatData} className="button-secondary">Export Report</Button>

            {reportData === 'no-data' && getVolumeReportTask && getVolumeReportTask.acceptance_criteria[1] && (
              <p className="error-message mt-4">No data found for the selected period.
                <em> (Edge Case: {getVolumeReportTask.acceptance_criteria[1]} Mocked)</em>
              </p>
            )}
            {reportData && reportData !== 'no-data' && reportType === 'volume' && getVolumeReportTask && getVolumeReportTask.acceptance_criteria[0] && (
              <div className="mock-api-response mt-4 success">
                <h4>Loan Application Processing Report ({reportData.period})</h4>
                <p><strong>Report Date:</strong> {reportData.reportDate}</p>
                <p><strong>Total Applications:</strong> {reportData.totalApplications}</p>
                <p><strong>Approved:</strong> {reportData.approved}</p>
                <p><strong>Rejected:</strong> {reportData.rejected}</p>
                <p><strong>Average Turnaround Time:</strong> {reportData.avgTurnaroundDays} days</p>
                <p className="success-message mt-2">
                  <em>Acceptance Criteria (Positive): {getVolumeReportTask.acceptance_criteria[0]} (Mocked: Report graph and export option shown)</em>
                </p>
              </div>
            )}
            {csatData && csatData !== 'no-data' && reportType === 'csat' && getCsatTask && getCsatTask.acceptance_criteria[0] && (
              <div className="mock-api-response mt-4 success">
                <h4>Customer Satisfaction Report ({csatData.period})</h4>
                <p><strong>Report Date:</strong> {csatData.reportDate}</p>
                <p><strong>Average CSAT Score:</strong> {csatData.averageScore} / 5</p>
                <p><strong>Total Surveys:</strong> {csatData.totalSurveys}</p>
                <h5>Recent Comments:</h5>
                <ul>
                  {csatData.comments.map((comment, idx) => <li key={idx}>"{comment}"</li>)}
                </ul>
                <p className="success-message mt-2">
                  <em>Acceptance Criteria (Positive): {getCsatTask.acceptance_criteria[0]} (Mocked: Metric trends and recent comments displayed)</em>
                </p>
              </div>
            )}
            {csatData === 'insufficient-data' && reportType === 'csat' && getCsatTask && getCsatTask.acceptance_criteria[1] && (
              <p className="error-message mt-4">Insufficient survey data (low sample size) to generate robust metrics.
                <em> (Negative Case: {getCsatTask.acceptance_criteria[1]} Mocked)</em>
              </p>
            )}
            {csatData === 'no-data' && reportType === 'csat' && (
              <p className="error-message mt-4">No survey data found for the selected period.
                <em> (General empty state for CSAT)</em>
              </p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReportingPage;