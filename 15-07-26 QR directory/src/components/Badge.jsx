import './Badge.css';

const STATUS_MAP = {
  Active: 'success',
  'On Leave': 'warning',
  Inactive: 'danger',
};

export default function Badge({ status }) {
  const tone = STATUS_MAP[status] || 'neutral';
  return (
    <span className={`badge badge--${tone}`}>
      <span className="badge__dot" />
      {status}
    </span>
  );
}
