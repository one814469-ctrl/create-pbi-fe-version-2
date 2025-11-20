import React, { useState } from 'react';

const FilterSearch = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    applicantName: '',
    submissionDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  return (
    <div className="card" style={{ marginBottom: '1.5em' }}>
      <h3>Filter and Search Applications</h3>
      <div className="form-group">
        <label htmlFor="filterStatus">Status</label>
        <select id="filterStatus" name="status" value={filters.status} onChange={handleChange}>
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="pending-documents">Pending Documents</option>
          <option value="under-review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="manual-review">Manual Review</option>
          <option value="processed-by-core-system">Processed by Core System</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="filterName">Applicant Name</label>
        <input
          type="text"
          id="filterName"
          name="applicantName"
          value={filters.applicantName}
          onChange={handleChange}
          placeholder="Search by name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="filterDate">Submission Date</label>
        <input
          type="date"
          id="filterDate"
          name="submissionDate"
          value={filters.submissionDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
        <button onClick={handleSearch}>Apply Filters</button>
        <button className="button-secondary" onClick={() => {
          setFilters({ status: 'all', applicantName: '', submissionDate: '' });
          onFilter({ status: 'all', applicantName: '', submissionDate: '' });
        }}>Clear Filters</button>
      </div>
    </div>
  );
};

export default FilterSearch;