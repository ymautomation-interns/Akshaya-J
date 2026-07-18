import React, { useState, useRef } from 'react';
import { uploadExcelFile } from '../services/api';

const ALLOWED_EXTENSIONS = ['.xlsx', '.xls'];

/**
 * Handles file selection, client-side validation, upload progress,
 * and success/error feedback. Calls onUploadSuccess() so the parent
 * can refresh the data table.
 */
export default function FileUpload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return 'Please select a file.';
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return 'Invalid file type. Only .xlsx and .xls files are allowed.';
    }
    return '';
  };

  const handleFileChange = (file) => {
    setSuccess('');
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setError('');
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please choose a file before uploading.');
      return;
    }
    setUploading(true);
    setError('');
    setSuccess('');
    setProgress(0);

    try {
      const result = await uploadExcelFile(selectedFile, (evt) => {
        const percent = Math.round((evt.loaded * 100) / evt.total);
        setProgress(percent);
      });

      setSuccess(`Success! ${result.recordsInserted} record(s) inserted.`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Upload failed. Please try again.';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Upload Excel File</h5>

        <div
          className={`upload-dropzone ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
        >
          <p className="mb-1">Drag & drop an .xlsx or .xls file here, or click to browse</p>
          {selectedFile && (
            <p className="text-primary fw-semibold mb-0">{selectedFile.name}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="d-none"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
        </div>

        {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
        {success && <div className="alert alert-success mt-3 mb-0">{success}</div>}

        {uploading && (
          <div className="progress mt-3" style={{ height: '20px' }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        <button
          className="btn btn-primary mt-3"
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
        >
          {uploading ? 'Uploading...' : 'Upload & Save to Database'}
        </button>
      </div>
    </div>
  );
}
