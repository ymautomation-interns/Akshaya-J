import { X } from 'lucide-react';

const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]" onClick={onClose} />

      {/* Content */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 z-10 max-h-[90vh] overflow-y-auto animate-[fadeIn_.15s_ease-out]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-canvas rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
