import { useNavigate } from 'react-router-dom';
import { Home, ScanSearch } from 'lucide-react';
import Button from './Button';
import './NotFound.css';

export default function NotFound({
  title = 'Employee not found',
  message = "We couldn't find anyone matching that ID. They may have moved on, or the code might be mistyped.",
  code = '',
}) {
  const navigate = useNavigate();

  return (
    <div className="not-found scale-in">
      <div className="not-found__art" aria-hidden="true">
        <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="160" rx="80" ry="10" fill="#E8EDFE" />
          <rect x="55" y="40" width="110" height="90" rx="14" fill="#fff" stroke="#DDE4FB" strokeWidth="2" />
          <rect x="72" y="58" width="40" height="40" rx="8" fill="#E8EDFE" />
          <path d="M80 78h24M80 88h16" stroke="#8B7CF6" strokeWidth="3" strokeLinecap="round" />
          <rect x="122" y="58" width="30" height="8" rx="4" fill="#DDE4FB" />
          <rect x="122" y="72" width="30" height="8" rx="4" fill="#DDE4FB" />
          <rect x="122" y="86" width="20" height="8" rx="4" fill="#DDE4FB" />
          <circle cx="150" cy="45" r="24" fill="#2F5FF3" />
          <path d="M142 45h16M150 37v16" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" transform="rotate(45 150 45)" />
          <circle cx="34" cy="60" r="6" fill="#C9BFFB" />
          <circle cx="190" cy="120" r="5" fill="#8B7CF6" />
        </svg>
      </div>
      <div className="not-found__badge">
        <ScanSearch size={14} />
        {code || '404'}
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      <Button icon={Home} onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
}
