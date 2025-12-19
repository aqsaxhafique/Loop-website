import { useNavigate } from "react-router-dom";
import { SEO } from "../shared/SEO";
import "../admin/admin.css";

function ManageOrders() {
  const navigate = useNavigate();

  const orders = [
    { id: "#4521", customer: "John Doe", items: 3, total: 850, status: "Pending" },
    { id: "#4520", customer: "Jane Smith", items: 2, total: 650, status: "Processing" },
    { id: "#4519", customer: "Mike Johnson", items: 5, total: 1200, status: "Completed" },
    { id: "#4518", customer: "Sarah Williams", items: 1, total: 350, status: "Pending" },
  ];

  return (
    <div className="admin-dashboard">
      <SEO
        title="Manage Orders - Admin Dashboard"
        description="View and manage all customer orders"
        canonical={window.location.origin + "/admin/orders"}
      />

      <div className="dashboard-header">
        <div className="header-content">
          <button onClick={() => navigate("/admin/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1 className="dashboard-title">Manage Orders</h1>
          <p className="dashboard-subtitle">View and process customer orders</p>
        </div>
      </div>

      <div className="activity-card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ padding: "1rem", textAlign: "left" }}>Order ID</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Customer</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Items</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Total</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "1rem" }}>{order.id}</td>
                <td style={{ padding: "1rem" }}>{order.customer}</td>
                <td style={{ padding: "1rem" }}>{order.items}</td>
                <td style={{ padding: "1rem" }}>₨ {order.total}</td>
                <td style={{ padding: "1rem" }}>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { ManageOrders };
