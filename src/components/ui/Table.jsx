import React, { useState, useMemo } from 'react';
import Button from './Button';

const Table = ({ columns, data, onRowClick, actionsColumn = null }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} onClick={() => col.sortable && requestSort(col.key)}>
                {col.label}
                {col.sortable && (
                  <span>
                    {sortConfig.key === col.key ? (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼') : ''}
                  </span>
                )}
              </th>
            ))}
            {actionsColumn && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actionsColumn ? 1 : 0)} className="text-center">No data available.</td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} onClick={() => onRowClick && onRowClick(row)}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actionsColumn && (
                  <td>
                    {actionsColumn.render && actionsColumn.render(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;