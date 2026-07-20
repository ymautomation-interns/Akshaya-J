const VARIANTS = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm shadow-primary-600/20',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  danger: 'bg-red-50 hover:bg-red-100 text-red-600',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
  dark: 'bg-ink hover:bg-ink-soft text-white',
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon: Icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]
        ${VARIANTS[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;
