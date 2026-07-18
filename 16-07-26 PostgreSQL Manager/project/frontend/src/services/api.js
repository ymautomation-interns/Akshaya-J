// src/services/api.js
// Centralized Axios instance and API call helpers.

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Upload an Excel file (multipart/form-data).
 */
export async function uploadExcelFile(file, onUploadProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return response.data;
}

/**
 * Fetch paginated records.
 */
export async function fetchData(page = 1, limit = 10) {
  const response = await api.get('/data', { params: { page, limit } });
  return response.data;
}

/**
 * Trigger a file download (Excel or PDF) by requesting a blob and
 * programmatically clicking a temporary <a> link.
 */
async function downloadFile(url, filename) {
  const response = await api.get(url, { responseType: 'blob' });
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export const downloadExcelExport = () => downloadFile('/download/excel', 'exported_data.xlsx');
export const downloadPdfExport = () => downloadFile('/download/pdf', 'exported_data.pdf');

export default api;
