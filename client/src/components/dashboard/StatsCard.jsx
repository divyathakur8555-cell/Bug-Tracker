export default function StatsCard({
  label,
  value,
  icon: Icon,
  color = "purple",
  description,
}) {
  return (
    <div className="card stat-card dashboard-stat-card">

      <div className={`stat-icon ${color}`}>
        {Icon && <Icon size={22} />}
      </div>

      <div className="stat-card-content">
        <p>{label}</p>
        <h2>{value}</h2>
        <span>{description}</span>
      </div>

    </div>
  );
}