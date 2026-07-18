import { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { Download, Printer, Copy, RotateCcw, Check } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';
import { buildEmployeeQrValue, copyToClipboard, downloadSvgAsPng, printQrCode } from '../utils/qrUtils';
import { useToast } from '../hooks/useToast.jsx';
import './QRCard.css';

export default function QRCard({ employee, onReset }) {
  const svgWrapperRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!employee) return null;

  const qrValue = buildEmployeeQrValue(employee.employeeId);

  function getSvg() {
    return svgWrapperRef.current?.querySelector('svg') || null;
  }

  async function handleDownload() {
    try {
      await downloadSvgAsPng(getSvg(), `${employee.employeeId}-qr`);
      showToast('QR code downloaded as PNG', 'success');
    } catch {
      showToast('Could not export the QR code', 'warning');
    }
  }

  function handlePrint() {
    printQrCode(getSvg(), employee);
    showToast('Sending QR to printer…', 'info');
  }

  async function handleCopy() {
    const ok = await copyToClipboard(employee.employeeId);
    if (ok) {
      setCopied(true);
      showToast('Employee ID copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 1800);
    } else {
      showToast('Copy failed — please copy manually', 'warning');
    }
  }

  return (
    <div className="qr-card scale-in">
      <div className="qr-card__glow" aria-hidden="true" />

      <div className="qr-card__notch qr-card__notch--left" aria-hidden="true" />
      <div className="qr-card__notch qr-card__notch--right" aria-hidden="true" />

      <div className="qr-card__header">
        <span className="qr-card__eyebrow">Scan to view profile</span>
        <Badge status={employee.status} />
      </div>

      <div className="qr-card__code" ref={svgWrapperRef}>
        <QRCode
          value={qrValue}
          size={200}
          bgColor="#ffffff"
          fgColor="#12162B"
          level="M"
        />
      </div>

      <h3 className="qr-card__name">{employee.name}</h3>
      <p className="qr-card__id mono">{employee.employeeId}</p>
      <p className="qr-card__role">{employee.designation} · {employee.department}</p>

      <div className="qr-card__perforation" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="qr-card__actions">
        <Button variant="secondary" icon={Download} onClick={handleDownload}>
          Download PNG
        </Button>
        <Button variant="secondary" icon={Printer} onClick={handlePrint}>
          Print
        </Button>
        <Button variant="secondary" icon={copied ? Check : Copy} onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy ID'}
        </Button>
      </div>

      <Button variant="ghost" icon={RotateCcw} onClick={onReset} fullWidth>
        Generate another QR
      </Button>
    </div>
  );
}
