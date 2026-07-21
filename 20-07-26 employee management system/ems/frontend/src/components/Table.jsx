/**
 * Generic responsive table.
 * columns: [{ key, label, render? }]
 * data: array of row objects
 */
const Table = ({ columns, data, emptyMessage = 'No records found' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-card">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-canvas text-gray-500 uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3.5 whitespace-nowrap font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-14 text-center text-gray-400">
                <p className="text-sm">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id ?? idx} className="hover:bg-canvas/70 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 whitespace-nowrap text-gray-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
