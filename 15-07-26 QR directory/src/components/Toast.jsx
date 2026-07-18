import { CheckCircle2, X, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '../hooks/useToast.jsx';
import './Toast.css';

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

export default function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-viewport" role="status" aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || CheckCircle2;
        return (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <Icon size={18} strokeWidth={2.2} />
            <span>{t.message}</span>
            <button className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
