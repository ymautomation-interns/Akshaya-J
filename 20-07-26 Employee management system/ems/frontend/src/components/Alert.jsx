import { CheckCircle2, XCircle, X } from 'lucide-react';

const STYLES = {
  success: 'bg-primary-50 text-primary-700 border-primary-200',
  error: 'bg-red-50 text-red-700 border-red-200',
};

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
};

const Alert = ({ type = 'success', message, onClose }) => {
  if (!message) return null;
  const Icon = ICONS[type];

  return (
    <div className={`flex items-center justify-between gap-3 border rounded-xl px-4 py-3 text-sm mb-4 ${STYLES[type]}`}>
      <div className="flex items-center gap-2">
        <Icon size={18} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="opacity-70 hover:opacity-100">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
