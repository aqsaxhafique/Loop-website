import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./admin.css";

function QuickActionCard({ title, description, icon, color, onClick }) {
  return (
    <div className="quick-action-card" onClick={onClick}>
      <div className="action-icon" style={{ backgroundColor: `${color}15` }}>
        <FontAwesomeIcon icon={icon} size="xl" color={color} />
      </div>
      <div className="action-content">
        <h3 className="action-title">{title}</h3>
        <p className="action-description">{description}</p>
      </div>
      <div className="action-arrow">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export { QuickActionCard };
