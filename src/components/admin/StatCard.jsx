import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./admin.css";

function StatCard({ title, value, subtitle, icon, iconColor, bgColor }) {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-info">
          <h3 className="stat-title">{title}</h3>
          <p className="stat-value">{value}</p>
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        </div>
        <div className="stat-icon" style={{ backgroundColor: bgColor }}>
          <FontAwesomeIcon icon={icon} size="lg" color={iconColor} />
        </div>
      </div>
    </div>
  );
}

export { StatCard };
