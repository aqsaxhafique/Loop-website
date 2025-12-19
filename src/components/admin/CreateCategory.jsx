import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faImage } from "@fortawesome/free-solid-svg-icons";
import { SEO } from "../shared/SEO";
import "../admin/admin.css";

function CreateCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from name
      ...(name === "name" && {
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Category data:", formData);
    // Here you would typically send to API
    alert("Category created successfully!");
    navigate("/admin/categories");
  };

  return (
    <div className="admin-dashboard">
      <SEO
        title="Create Category - Admin Dashboard"
        description="Create a new product category"
        canonical={window.location.origin + "/admin/categories/new"}
      />

      <div className="dashboard-header">
        <div className="header-content">
          <button onClick={() => navigate("/admin/categories")} className="back-btn">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Categories
          </button>
          <h1 className="dashboard-title">Create New Category</h1>
          <p className="dashboard-subtitle">Add a new product category</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            {/* Name Field */}
            <div className="form-group">
              <label className="form-label">
                Category Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Pancakes"
                required
              />
            </div>

            {/* Slug Field */}
            <div className="form-group">
              <label className="form-label">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="form-input"
                placeholder="auto-generated-slug"
              />
              <p className="form-hint">Auto-generated from category name</p>
            </div>

            {/* Description Field */}
            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Brief description of this category..."
                rows="4"
              />
            </div>

            {/* Image Upload */}
            <div className="form-group full-width">
              <label className="form-label">Category Image</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                  id="category-image"
                />
                <label htmlFor="category-image" className="file-label">
                  <FontAwesomeIcon icon={faImage} size="2x" />
                  <p>Click to upload image</p>
                  {formData.image && (
                    <span className="file-name">{formData.image.name}</span>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/admin/categories")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { CreateCategory };
