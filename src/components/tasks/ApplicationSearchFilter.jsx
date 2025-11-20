import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ApplicationSearchFilter = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications } = useLoan();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResults, setFilterResults] = useState([]);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter' && user?.role !== 'manager')) {
    displayMessage('error', 'Access Denied', 'You need loan management permissions to search applications.');
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Loan Application Search & Filters</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Only loan officers, underwriters, and managers can search and filter applications.</p>
        </CardContent>
      </Card>
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilterResults([]);
      displayMessage('info', 'Search Info', 'Please enter a search term.');
      return;
    }

    const results = applications.filter(app =>
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilterResults(results);

    if (results.length === 0) {
      displayMessage('info', 'Search Results', `No applications found for "${searchTerm}".`);
    } else {
      displayMessage('success', 'Search Results', `${results.length} application(s) found.`);
    }
  };

  const getStatusBadgeVariant = (status) => {
    if (status.includes('Approved')) return 'default';
    if (status.includes('Rejected') || status.includes('Required') || status.includes('Manual')) return 'destructive';
    return 'secondary';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Loan Applications</CardTitle>
        <CardDescription>Search and filter loan applications by customer name or ID.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSearch} className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="searchTerm">Search by Customer Name, ID, or Application ID</Label>
            <Input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., John Doe, CUST001, LA001"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {filterResults.length > 0 && (
          <div className="space-y-4">
            <h6 className="text-lg font-semibold">Search Results:</h6>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>App ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterResults.map(app => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.id}</TableCell>
                      <TableCell>{app.customerName}</TableCell>
                      <TableCell>{app.customerID}</TableCell>
                      <TableCell>{app.type}</TableCell>
                      <TableCell>${app.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        {filterResults.length === 0 && searchTerm.trim() && (
          <p className="text-muted-foreground italic mt-4">No applications found matching your search criteria.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationSearchFilter;