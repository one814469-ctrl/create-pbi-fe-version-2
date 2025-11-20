import React, { useState } from 'react';
import { mockReports } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReportGenerator = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const [reportType, setReportType] = useState('applicationVolume');
  const [dateRange, setDateRange] = useState('2023-01 - 2023-06'); // Mock date range
  const [generatedReport, setGeneratedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || user?.role !== 'manager') {
    displayMessage('destructive', 'Access Denied', 'You need manager permissions to generate reports.');
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
          <CardDescription>Application Volume & Turnaround Reports</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Only managers can generate loan application reports.</p>
        </CardContent>
      </Card>
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
      displayMessage('destructive', 'Export Failed', 'No report data to export.');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Loan Application Processing Report</CardTitle>
        <CardDescription>View and export statistics on loan volume and processing speed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType} disabled={loading}>
              <SelectTrigger id="reportType" className="w-full">
                <SelectValue placeholder="Select a report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applicationVolume">Application Volume</SelectItem>
                <SelectItem value="turnaroundTime">Average Turnaround Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateRange">Date Range (Mock)</Label>
            <Input
              id="dateRange"
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              disabled={loading}
              readOnly // For mock, date range is static
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {generatedReport.data.labels.map((label, index) => <TableHead key={index}>{label}</TableHead>)}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        {generatedReport.data.data.map((value, index) => <TableCell key={index}>{value}</TableCell>)}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <Button onClick={handleExportReport} className="mt-4">Export as CSV</Button>
              </div>
            ) : (
              <p className="text-muted-foreground italic">{generatedReport.message}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;