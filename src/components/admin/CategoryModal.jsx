import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "../admin/admin.css";

function CategoryModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCategory = {
      id: Date.now(),
      name: formData.name,
      slug: formData.slug,
      productCount: 0,
      createdAt: new Date().toISOString(),
    };
    onSave(newCategory);
    setFormData({ name: "", slug: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Category</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
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
              placeholder="e.g., Desserts"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="form-input"
              placeholder="auto-generated-slug"
              readOnly
            />
            <p className="form-hint">Auto-generated from category name</p>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
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

export { CategoryModal };
