import { useState } from 'react';
import { ScanLine, Search, AlertCircle } from 'lucide-react';
import QRCard from '../components/QRCard';
import { findEmployeeById } from '../hooks/useEmployees';
import { useToast } from '../hooks/useToast.jsx';
import './Home.css';

export default function Home() {
  const { showToast } = useToast();
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [qrEmployee, setQrEmployee] = useState(null);
  const [error, setError] = useState('');

  function handleGenerate(e) {
    e.preventDefault();
    const trimmed = employeeIdInput.trim();

    if (!trimmed) {
      setError('Please enter an Employee ID');
      setQrEmployee(null);
      return;
    }

    const employee = findEmployeeById(trimmed);

    if (!employee) {
      setError('Employee ID not found');
      setQrEmployee(null);
      return;
    }

    setError('');
    setQrEmployee(employee);
    showToast(`QR code generated for ${employee.name}`, 'success');
  }

  function handleChange(e) {
    setEmployeeIdInput(e.target.value);
    if (error) setError('');
  }

  function handleReset() {
    setQrEmployee(null);
    setEmployeeIdInput('');
    setError('');
  }

  return (
    <section className="generator">
      <div className="generator__backdrop" aria-hidden="true" />

      <div className="container generator__inner">
        <div className="generator-card fade-in">
          <div className="generator-card__icon">
            <ScanLine size={26} strokeWidth={2.2} />
          </div>

          <h1>Employee QR Generator</h1>
          <p className="generator-card__subtitle">Generate secure employee profile QR codes</p>

          <form className="generator-card__form" onSubmit={handleGenerate}>
            <label htmlFor="employeeId">Employee ID</label>
            <div className={`generator-card__input-wrap ${error ? 'has-error' : ''}`}>
              <Search size={16} className="generator-card__input-icon" />
              <input
                id="employeeId"
                type="text"
                placeholder="e.g. EMP001"
                value={employeeIdInput}
                onChange={handleChange}
                autoComplete="off"
                autoFocus
              />
            </div>

            {error && (
              <p className="generator-card__error">
                <AlertCircle size={14} /> {error}
              </p>
            )}

            <button type="submit" className="generator-card__submit">
              Generate QR
            </button>
          </form>
        </div>

        {qrEmployee && <QRCard employee={qrEmployee} onReset={handleReset} />}
      </div>
    </section>
  );
}
