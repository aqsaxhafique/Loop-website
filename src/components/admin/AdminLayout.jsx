import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faTachometerAlt,
  faShoppingCart,
  faBoxes,
  faPlus,
  faTicketAlt,
  faChartBar,
  faChartLine,
  faUsers,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./admin.css";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 1,
      title: "Dashboard",
      icon: faTachometerAlt,
      route: "/admin/dashboard",
    },
    {
      id: 2,
      title: "Analytics",
      icon: faChartLine,
      route: "/admin/analytics",
    },
    {
      id: 3,
      title: "Categories",
      icon: faBoxes,
      route: "/admin/categories",
    },
    {
      id: 4,
      title: "Add Product",
      icon: faPlus,
      route: "/admin/products/new",
    },
    {
      id: 5,
      title: "View Inventory",
      icon: faBoxes,
      route: "/admin/inventory",
    },
    {
      id: 6,
      title: "Manage Orders",
      icon: faShoppingCart,
      route: "/admin/orders",
    },
    {
      id: 7,
      title: "Coupons",
      icon: faTicketAlt,
      route: "/admin/coupons",
    },
    {
      id: 8,
      title: "Reports",
      icon: faChartBar,
      route: "/admin/reports",
    },
    {
      id: 9,
      title: "Customers",
      icon: faUsers,
      route: "/admin/customers",
    },
    {
      id: 10,
      title: "Settings",
      icon: faCog,
      route: "/admin/settings",
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (route) => {
    return location.pathname === route;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-brand">Loop Admin</h2>
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive(item.route) ? "active" : ""}`}
              onClick={() => navigate(item.route)}
            >
              <FontAwesomeIcon icon={item.icon} className="nav-icon" />
              {sidebarOpen && <span className="nav-text">{item.title}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-nav-item logout-btn" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
            {sidebarOpen && <span className="nav-text">Exit Admin</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* Mobile Toggle */}
        <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>

        <Outlet />
      </main>
    </div>
  );
}

export { AdminLayout };
