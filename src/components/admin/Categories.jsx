import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { SEO } from "../shared/SEO";
import "../admin/admin.css";

// Mock categories data
const mockCategories = [
  {
    id: 1,
    name: "Pancakes",
    slug: "pancakes",
    description: "Delicious handcrafted pancakes",
    productCount: 12,
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    name: "Waffles",
    slug: "waffles",
    description: "Belgian and classic waffles",
    productCount: 8,
    createdAt: "2025-02-10",
  },
  {
    id: 3,
    name: "Savory Items",
    slug: "savory-items",
    description: "Savory treats and snacks",
    productCount: 6,
    createdAt: "2025-03-05",
  },
];

function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div className="admin-dashboard">
      <SEO
        title="Categories - Admin Dashboard"
        description="Manage product categories"
        canonical={window.location.origin + "/admin/categories"}
      />

      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Categories</h1>
          <p className="dashboard-subtitle">
            Manage product categories and organization
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => navigate("/admin/categories/new")}
          >
            <FontAwesomeIcon icon={faPlus} /> Create Category
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Products</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No categories found
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="font-semibold">{category.name}</td>
                  <td className="text-gray">{category.slug}</td>
                  <td>{category.description}</td>
                  <td>
                    <span className="badge badge-completed">
                      {category.productCount} items
                    </span>
                  </td>
                  <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() =>
                          navigate(`/admin/categories/edit/${category.id}`)
                        }
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(category.id)}
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { Categories };
