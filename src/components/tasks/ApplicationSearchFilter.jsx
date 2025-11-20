import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';

const ApplicationSearchFilter = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { applications } = useLoan();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResults, setFilterResults] = useState([]);

  // Guardrail: Access control for non-authenticated or incorrect role
  if (!isAuthenticated || (user?.role !== 'officer' && user?.role !== 'underwriter' && user?.role !== 'manager')) {
    displayMessage('error', 'Access denied. You need loan management permissions to search applications.');
    return (
      <p className="error-message">
        Access Denied: Only loan officers, underwriters, and managers can search and filter applications.
      </p>
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilterResults([]);
      displayMessage('info', 'Please enter a search term.');
      return;
    }

    // Acceptance Criteria: When I enter a name or ID and submit a search
    const results = applications.filter(app =>
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilterResults(results);

    // Acceptance Criteria: [Edge] Given no search results
    if (results.length === 0) {
      displayMessage('info', `No applications found for "${searchTerm}".`);
    } else {
      displayMessage('success', `${results.length} application(s) found.`);
    }
  };

  return (
    <div className="dashboard-card">
      <h5>Search Loan Applications</h5>
      <form onSubmit={handleSearch} className="search-filter-container">
        <div className="form-group" style={{ flexGrow: 1, marginBottom: 0 }}>
          <label htmlFor="searchTerm">Search by Customer Name, ID, or Application ID:</label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g., John Doe, CUST001, LA001"
          />
        </div>
        <button type="submit">Search</button>
      </form>

      {filterResults.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h6>Search Results:</h6>
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
                  <td>{app.id}</td>
                  <td>{app.customerName}</td>
                  <td>{app.customerID}</td>
                  <td>{app.type}</td>
                  <td>${app.amount.toLocaleString()}</td>
                  <td>{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {filterResults.length === 0 && searchTerm.trim() && (
         <p className="info-message" style={{marginTop: '1.5rem'}}>No applications found matching your search criteria.</p>
      )}
    </div>
  );
};

export default ApplicationSearchFilter;