function StatCard({
  title,
  value,
  description,
  icon,
  type = "default",
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${type}`}>
        {icon}
      </div>

      <div className="stat-content">
        <span className="stat-title">{title}</span>

        <h2>{value}</h2>

        <p>{description}</p>
      </div>
    </div>
  );
}

export default StatCard;