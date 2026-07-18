import './ProfileCard.css';

/**
 * A titled card that groups a list of label/value fields.
 * fields: [{ icon, label, value }]
 */
export default function ProfileCard({ title, icon: TitleIcon, fields = [] }) {
  return (
    <div className="profile-card fade-in">
      <div className="profile-card__title">
        {TitleIcon && <TitleIcon size={17} />}
        <h4>{title}</h4>
      </div>
      <dl className="profile-card__fields">
        {fields.map(({ icon: Icon, label, value }) => (
          <div className="profile-card__field" key={label}>
            <dt>
              {Icon && <Icon size={15} />}
              {label}
            </dt>
            <dd>{value || '—'}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
