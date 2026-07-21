const Input = ({ label, name, value, onChange, placeholder = '', error, type = 'text', disabled = false }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none transition-colors
          focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500
          disabled:bg-gray-100 disabled:text-gray-400
          ${error ? 'border-red-400' : 'border-gray-200'}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
