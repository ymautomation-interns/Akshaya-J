import React, { useState, useEffect, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import { fetchData, downloadExcelExport, downloadPdfExport } from './services/api';

const PAGE_SIZE = 10;

export default function App() {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadError, setDownloadError] = useState('');

  const loadData = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchData(page, PAGE_SIZE);
      setRecords(result.records || []);
      setTotalPages(result.totalPages || 1);
      setTotalRecords(result.totalRecords || 0);
      setCurrentPage(result.currentPage || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    loadData(page);
  };

  const handleUploadSuccess = () => {
    loadData(1); // refresh table from page 1 after a new upload
  };

  const handleDownload = async (type) => {
    setDownloadError('');
    try {
      if (type === 'excel') await downloadExcelExport();
      else await downloadPdfExport();
    } catch (err) {
      setDownloadError(`Failed to download ${type.toUpperCase()} file.`);
    }
  };

  return (
    <div className="app-container">
      <header className="mb-4 text-center">
        <h1 className="fw-bold">Excel &rarr; PostgreSQL Manager</h1>
        <p className="text-muted">Upload Excel data, store it in PostgreSQL, and export it back out.</p>
      </header>

      <FileUpload onUploadSuccess={handleUploadSuccess} />

      <div className="d-flex flex-wrap gap-2 justify-content-end mb-3">
        <button className="btn btn-success" onClick={() => handleDownload('excel')}>
          Download Excel
        </button>
        <button className="btn btn-danger" onClick={() => handleDownload('pdf')}>
          Download PDF
        </button>
      </div>

      {downloadError && <div className="alert alert-warning">{downloadError}</div>}

      <DataTable
        records={records}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
