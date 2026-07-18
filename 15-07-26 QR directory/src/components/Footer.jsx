import { ShieldCheck } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>© {new Date().getFullYear()} Nexora Technologies. All rights reserved.</span>
        <span className="footer__badge">
          <ShieldCheck size={14} />
          Data stays on this device — no backend involved
        </span>
      </div>
    </footer>
  );
}
