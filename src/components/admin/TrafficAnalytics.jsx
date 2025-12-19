import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faEye,
  faChartLine,
  faPercentage,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { SEO } from "../shared/SEO";
import "./admin.css";

function TrafficAnalytics() {
  // Mock analytics data
  const stats = {
    visitorsToday: 1240,
    pageViewsToday: 4320,
    weeklyVisitors: 8450,
    bounceRate: 42.5,
  };

  const changes = {
    visitors: +12,
    pageViews: +8,
    weekly: +15,
    bounce: -2.5,
  };

  // Weekly traffic data
  const weeklyData = [
    { day: "Mon", visitors: 1200, percentage: 75 },
    { day: "Tue", visitors: 1350, percentage: 84 },
    { day: "Wed", visitors: 1100, percentage: 69 },
    { day: "Thu", visitors: 1450, percentage: 91 },
    { day: "Fri", visitors: 1600, percentage: 100 },
    { day: "Sat", visitors: 900, percentage: 56 },
    { day: "Sun", visitors: 850, percentage: 53 },
  ];

  // Device breakdown
  const deviceData = [
    { name: "Mobile", value: 72, color: "#4b2c20" },
    { name: "Desktop", value: 26, color: "#d4a574" },
    { name: "Tablet", value: 2, color: "#8b5a3c" },
  ];

  // Traffic sources
  const sourcesData = [
    { name: "Direct", value: 35, color: "#4b2c20" },
    { name: "Google", value: 28, color: "#8b5a3c" },
    { name: "Instagram", value: 20, color: "#d4a574" },
    { name: "Facebook", value: 12, color: "#c19a6b" },
    { name: "Referral", value: 5, color: "#f5eadd" },
  ];

  // Top pages
  const topPages = [
    { page: "/products", views: 1520, percentage: 28, avgTime: "3:24" },
    { page: "/", views: 1240, percentage: 23, avgTime: "2:15" },
    { page: "/about", views: 890, percentage: 16, avgTime: "1:42" },
    { page: "/cart", views: 650, percentage: 12, avgTime: "4:10" },
    { page: "/contact", views: 420, percentage: 8, avgTime: "1:05" },
  ];

  return (
    <>
      <SEO
        title="Traffic Analytics - Loop Admin"
        description="View website traffic analytics and statistics"
      />
      <div className="admin-content">
        <h1>Traffic Analytics</h1>

        {/* Top Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="stat-details">
              <h3>Visitors Today</h3>
              <p className="stat-value">{stats.visitorsToday.toLocaleString()}</p>
              <span className={`stat-change ${changes.visitors > 0 ? "positive" : "negative"}`}>
                <FontAwesomeIcon icon={changes.visitors > 0 ? faArrowUp : faArrowDown} />
                {Math.abs(changes.visitors)}% vs yesterday
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faEye} />
            </div>
            <div className="stat-details">
              <h3>Page Views Today</h3>
              <p className="stat-value">{stats.pageViewsToday.toLocaleString()}</p>
              <span className={`stat-change ${changes.pageViews > 0 ? "positive" : "negative"}`}>
                <FontAwesomeIcon icon={changes.pageViews > 0 ? faArrowUp : faArrowDown} />
                {Math.abs(changes.pageViews)}% vs yesterday
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <div className="stat-details">
              <h3>Weekly Visitors</h3>
              <p className="stat-value">{stats.weeklyVisitors.toLocaleString()}</p>
              <span className={`stat-change ${changes.weekly > 0 ? "positive" : "negative"}`}>
                <FontAwesomeIcon icon={changes.weekly > 0 ? faArrowUp : faArrowDown} />
                {Math.abs(changes.weekly)}% vs last week
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faPercentage} />
            </div>
            <div className="stat-details">
              <h3>Bounce Rate</h3>
              <p className="stat-value">{stats.bounceRate}%</p>
              <span className={`stat-change ${changes.bounce < 0 ? "positive" : "negative"}`}>
                <FontAwesomeIcon icon={changes.bounce < 0 ? faArrowDown : faArrowUp} />
                {Math.abs(changes.bounce)}% vs yesterday
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Weekly Traffic Bar Chart */}
          <div className="chart-card">
            <h3>Weekly Traffic Trend</h3>
            <div className="bar-chart">
              {weeklyData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-wrapper">
                    <div
                      className="bar-fill"
                      style={{ height: `${item.percentage}%` }}
                      title={`${item.visitors} visitors`}
                    ></div>
                  </div>
                  <span className="bar-label">{item.day}</span>
                  <span className="bar-value">{item.visitors}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="chart-card">
            <h3>Device Breakdown</h3>
            <div className="pie-chart-legend">
              {deviceData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="legend-info">
                    <span className="legend-name">{item.name}</span>
                    <span className="legend-value">{item.value}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="chart-card">
            <h3>Traffic Sources</h3>
            <div className="pie-chart-legend">
              {sourcesData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="legend-info">
                    <span className="legend-name">{item.name}</span>
                    <span className="legend-value">{item.value}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pages Table */}
        <div className="chart-card">
          <h3>Top Pages</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Views</th>
                <th>% of Total</th>
                <th>Avg. Time on Page</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, index) => (
                <tr key={index}>
                  <td>{page.page}</td>
                  <td>{page.views.toLocaleString()}</td>
                  <td>{page.percentage}%</td>
                  <td>{page.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export { TrafficAnalytics };
