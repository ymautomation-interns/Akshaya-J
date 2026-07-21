const Loader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-14 text-gray-500">
      <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default Loader;
