import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';

const ApplicationSearchFilter = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications } = useLoan();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResults, setFilterResults] = useState([]);

  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter' && user?.role !== 'manager')) {
    displayMessage('error', 'Access Denied', 'You need loan management permissions to search applications.');
    return (
      <div className="card w-full max-w-md mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Loan Application Search & Filters</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only loan officers, underwriters, and managers can search and filter applications.</p>
        </div>
      </div>
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

  const getStatusBadgeClass = (status) => {
    if (status.includes('Approved')) return 'badge-default';
    if (status.includes('Rejected') || status.includes('Required') || status.includes('Manual')) return 'badge-destructive';
    return 'badge-secondary';
  };

  return (
    <div className="card w-full">
      <div className="card-header">
        <h3 className="card-title">Search Loan Applications</h3>
        <p className="card-description">Search and filter loan applications by customer name or ID.</p>
      </div>
      <div className="card-content space-y-6">
        <form onSubmit={handleSearch} className="flex-row items-end space-x-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="searchTerm" className="block text-sm font-medium">Search by Customer Name, ID, or Application ID</label>
            <input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., John Doe, CUST001, LA001"
              className="w-full"
            />
          </div>
          <button type="submit">Search</button>
        </form>

        {filterResults.length > 0 && (
          <div className="space-y-4">
            <h6 className="text-lg font-semibold">Search Results:</h6>
            <div className="rounded-md border overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Customer Name</th>
                    <th>Customer ID</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filterResults.map(app => (
                    <tr key={app.id}>
                      <td className="font-medium">{app.id}</td>
                      <td>{app.customerName}</td>
                      <td>{app.customerID}</td>
                      <td>{app.type}</td>
                      <td>${app.amount.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {filterResults.length === 0 && searchTerm.trim() && (
          <p className="text-muted-foreground italic mt-4">No applications found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default ApplicationSearchFilter;