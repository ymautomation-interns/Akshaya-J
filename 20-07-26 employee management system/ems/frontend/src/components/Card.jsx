const COLOR_MAP = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-primary-50 text-primary-700',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-accent-100 text-accent-700',
};

const Card = ({ title, value, icon: Icon, color = 'blue', hint }) => {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 flex items-center justify-between hover:shadow-card-hover transition-shadow">
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
        <p className="text-2xl font-display font-bold text-gray-900 mt-1 tabular">{value}</p>
        {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${COLOR_MAP[color]}`}>
        {Icon && <Icon size={22} />}
      </div>
    </div>
  );
};

export default Card;
