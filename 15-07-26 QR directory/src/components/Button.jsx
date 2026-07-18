import './Button.css';

/**
 * Shared button with a subtle ripple effect, used across the whole app.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 */
export default function Button({
  children,
  variant = 'primary',
  icon: Icon,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest
}) {
  function handleClick(e) {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
    circle.classList.add('btn-ripple');

    const existing = btn.getElementsByClassName('btn-ripple')[0];
    if (existing) existing.remove();
    btn.appendChild(circle);

    onClick?.(e);
  }

  return (
    <button
      type={type}
      className={`btn btn--${variant} ${fullWidth ? 'btn--full' : ''} ${className}`}
      onClick={disabled ? undefined : handleClick}
      disabled={disabled}
      {...rest}
    >
      {Icon && <Icon size={18} strokeWidth={2.2} />}
      <span>{children}</span>
    </button>
  );
}
