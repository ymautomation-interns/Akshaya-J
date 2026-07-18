import React from 'react';
import Pagination from './Pagination';

/**
 * Renders records in a Bootstrap table, dynamically building columns
 * from whatever keys are present on the first record (so this works
 * for ANY uploaded Excel schema, not just the sample columns).
 */
export default function DataTable({
  records,
  loading,
  error,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
}) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!records || records.length === 0) {
    return <div className="alert alert-info">No data available. Upload an Excel file to get started.</div>;
  }

  const columns = Object.keys(records[0]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Stored Records</h5>
          <span className="badge bg-secondary">Total: {totalRecords}</span>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col.replace(/_/g, ' ').toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((row, idx) => (
                <tr key={row.id ?? idx}>
                  {columns.map((col) => (
                    <td key={col}>{row[col] !== null && row[col] !== undefined ? String(row[col]) : ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
