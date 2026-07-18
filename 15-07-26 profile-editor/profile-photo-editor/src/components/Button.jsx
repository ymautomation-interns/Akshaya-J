import React from "react";
import PropTypes from "prop-types";

/**
 * Button
 * ---------------------------------------------------------------------------
 * Generic, themeable button used throughout the editor (modal actions,
 * option rows, camera shutter, etc.). Keeping it separate means every button
 * in the app shares the same focus ring, hover, and disabled behaviour.
 * ---------------------------------------------------------------------------
 */
export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  type = "button",
  className = "",
  ...rest
}) {
  const base =
    "pe-btn inline-flex items-center justify-center gap-2 font-medium select-none " +
    "rounded-full transition-all duration-200 ease-out focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c1f24] focus-visible:ring-emerald-400 " +
    "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96]";

  const variants = {
    primary:
      "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/30 hover:brightness-110 hover:-translate-y-0.5",
    secondary:
      "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10 hover:border-white/20 hover:-translate-y-0.5",
    ghost: "bg-transparent text-slate-200 hover:bg-white/10",
    danger: "bg-transparent text-red-400 hover:bg-red-500/10",
    subtle: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-6 py-3",
    icon: "p-2.5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          className="pe-spinner h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary", "ghost", "danger", "subtle"]),
  size: PropTypes.oneOf(["sm", "md", "lg", "icon"]),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
};
