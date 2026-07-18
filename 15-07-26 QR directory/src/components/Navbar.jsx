import { Link, useLocation } from 'react-router-dom';
import { ScanLine, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">
            <ScanLine size={20} strokeWidth={2.4} />
          </span>
          <span className="navbar__title">
            Nexora <strong>Employee QR</strong>
          </span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          <Link to="/" className={location.pathname === '/' ? 'is-active' : ''}>
            Generate
          </Link>
        </nav>

        <button
          className="navbar__theme-toggle"
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
