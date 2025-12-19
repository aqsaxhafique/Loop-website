import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StatCard } from "./StatCard";
import { QuickActionCard } from "./QuickActionCard";
import { SEO } from "../shared/SEO";
import "./admin.css";

// Icons using Font Awesome (already in project)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faShoppingCart,
  faUsers,
  faExclamationTriangle,
  faPlus,
  faClipboardList,
  faBoxes,
  faTicketAlt,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        setAnalytics(response.data.analytics);
        setLastUpdated(new Date());
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setLoading(false);
    }
  };

  const stats = analytics ? [
    {
      id: 1,
      title: "Total Sales",
      value: `Rs. ${analytics.totalSales}`,
      subtitle: "All time",
      icon: faDollarSign,
      iconColor: "#10b981",
      bgColor: "#d1fae5",
    },
    {
      id: 2,
      title: "Total Orders",
      value: analytics.totalOrders.toString(),
      subtitle: `${analytics.activeOrders} active`,
      icon: faShoppingCart,
      iconColor: "#3b82f6",
      bgColor: "#dbeafe",
    },
    {
      id: 3,
      title: "Total Customers",
      value: analytics.totalCustomers.toString(),
      subtitle: "Registered users",
      icon: faUsers,
      iconColor: "#8b5cf6",
      bgColor: "#ede9fe",
    },
    {
      id: 4,
      title: "Low Stock Items",
      value: analytics.lowStockItems.toString(),
      subtitle: "Needs restocking",
      icon: faExclamationTriangle,
      iconColor: "#ef4444",
      bgColor: "#fee2e2",
    },
  ] : [];

  const quickActions = [
    {
      id: 1,
      title: "Add New Product",
      description: "Create a new product listing",
      icon: faPlus,
      color: "#10b981",
      route: "/admin/products/new",
    },
    {
      id: 2,
      title: "Manage Orders",
      description: "View and process orders",
      icon: faClipboardList,
      color: "#3b82f6",
      route: "/admin/orders",
    },
    {
      id: 3,
      title: "View Inventory",
      description: "Check stock levels",
      icon: faBoxes,
      color: "#f59e0b",
      route: "/admin/inventory",
    },
    {
      id: 4,
      title: "Create Coupon",
      description: "Generate discount codes",
      icon: faTicketAlt,
      color: "#ec4899",
      route: "/admin/coupons",
    },
    {
      id: 5,
      title: "View Reports",
      description: "Analytics and insights",
      icon: faChartBar,
      color: "#8b5cf6",
      route: "/admin/reports",
    },
  ];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <SEO
        title="Admin Dashboard - Loop"
        description="Manage your Loop bakery business - orders, products, inventory, and analytics"
        canonical={window.location.origin + "/admin/dashboard"}
      />

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your store today.
          </p>
          {lastUpdated && (
            <p className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchAnalytics}>
            <FontAwesomeIcon icon={faChartBar} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.id}
              {...action}
              onClick={() => navigate(action.route)}
            />
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="recent-activity-section">
        <h2 className="section-title">Recent Orders</h2>
        <div className="activity-card">
          {analytics && analytics.recentOrders && analytics.recentOrders.length > 0 ? (
            analytics.recentOrders.slice(0, 5).map((order) => (
              <div className="activity-item" key={order.id}>
                <div className="activity-icon" style={{ background: "#dbeafe" }}>
                  <FontAwesomeIcon icon={faShoppingCart} color="#3b82f6" />
                </div>
                <div className="activity-details">
                  <p className="activity-text">
                    Order #{order.orderNumber} - Rs. {order.totalAmount} ({order.status})
                  </p>
                  <span className="activity-time">{order.customerEmail}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="activity-item">
              <div className="activity-icon" style={{ background: "#fee2e2" }}>
                <FontAwesomeIcon icon={faExclamationTriangle} color="#ef4444" />
              </div>
              <div className="activity-details">
                <p className="activity-text">No recent orders</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { AdminDashboard };
