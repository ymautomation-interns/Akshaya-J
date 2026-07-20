const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none transition-colors bg-white
          focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500
          disabled:bg-gray-100 disabled:text-gray-400
          ${error ? 'border-red-400' : 'border-gray-200'}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
