const PALETTE = [
  'bg-primary-100 text-primary-700',
  'bg-accent-100 text-accent-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-rose-100 text-rose-700',
];

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const hashToIndex = (str = '', mod) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) hash = (hash * 31 + str.charCodeAt(i)) % 1000;
  return hash % mod;
};

const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
};

const Avatar = ({ name, size = 'md', className = '' }) => {
  const colorClass = PALETTE[hashToIndex(name, PALETTE.length)];
  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-semibold font-display ${SIZES[size]} ${colorClass} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
