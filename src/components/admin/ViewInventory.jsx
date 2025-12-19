import { useNavigate } from "react-router-dom";
import { SEO } from "../shared/SEO";
import "../admin/admin.css";

function ViewInventory() {
  const navigate = useNavigate();

  const inventory = [
    { id: 1, name: "Chocolate Pancakes", stock: 8, category: "Pancakes", status: "Low" },
    { id: 2, name: "Blueberry Waffles", stock: 25, category: "Waffles", status: "In Stock" },
    { id: 3, name: "Maple Syrup Pancakes", stock: 15, category: "Pancakes", status: "In Stock" },
    { id: 4, name: "Belgian Waffles", stock: 5, category: "Waffles", status: "Low" },
  ];

  return (
    <div className="admin-dashboard">
      <SEO
        title="View Inventory - Admin Dashboard"
        description="Check and manage product stock levels"
        canonical={window.location.origin + "/admin/inventory"}
      />

      <div className="dashboard-header">
        <div className="header-content">
          <button onClick={() => navigate("/admin/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1 className="dashboard-title">Inventory Management</h1>
          <p className="dashboard-subtitle">Monitor stock levels and restock items</p>
        </div>
      </div>

      <div className="activity-card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ padding: "1rem", textAlign: "left" }}>Product</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Category</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Stock</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "1rem" }}>{item.name}</td>
                <td style={{ padding: "1rem" }}>{item.category}</td>
                <td style={{ padding: "1rem" }}>{item.stock} units</td>
                <td style={{ padding: "1rem" }}>
                  <span className={`badge badge-${item.status === "Low" ? "pending" : "completed"}`}>
                    {item.status}
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

export { ViewInventory };
