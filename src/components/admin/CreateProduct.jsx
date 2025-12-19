import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faImage,
  faMagic,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { SEO } from "../shared/SEO";
import { CategoryModal } from "./CategoryModal";
import "../admin/admin.css";

const API_URL = "http://localhost:5000/api";

function CreateProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    altText: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUrlChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: e.target.value,
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "create-new") {
      setIsCategoryModalOpen(true);
      // Reset select to empty
      setFormData((prev) => ({ ...prev, categoryId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, categoryId: value }));
    }
  };

  const handleCategorySave = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    setFormData((prev) => ({ ...prev, categoryId: newCategory.id.toString() }));
    setIsCategoryModalOpen(false);
  };

  const handleGenerateDescription = async () => {
    if (!formData.title) {
      toast.error("Please enter a product title first");
      return;
    }

    setIsGeneratingDescription(true);
    
    try {
      const question = `Generate a short, SEO-friendly product description for a bakery item called "${formData.title}". Make it appetizing and highlight quality ingredients. Keep it under 150 words.`;
      
      const response = await axios.post(`${API_URL}/auth/ask`, {
        question: question
      });

      if (response.data.success) {
        setFormData((prev) => ({ ...prev, description: response.data.answer }));
        toast.success("AI description generated!");
      }
    } catch (error) {
      console.error("Failed to generate description:", error);
      toast.error("Failed to generate description. Using fallback.");
      
      // Fallback to simple description if API fails
      const generatedText = `Delicious ${formData.title} made with premium ingredients. Perfect for breakfast or as a special treat. Handcrafted with care by our expert bakers.`;
      setFormData((prev) => ({ ...prev, description: generatedText }));
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!formData.title) {
      toast.error("Please enter a product title first");
      return;
    }

    setIsGeneratingSEO(true);
    
    try {
      const categoryName = categories.find(c => c.id === parseInt(formData.categoryId))?.name || 'bakery item';
      
      const response = await axios.post(`${API_URL}/auth/generate-seo`, {
        productTitle: formData.title,
        description: formData.description,
        category: categoryName
      });

      if (response.data.success) {
        setFormData((prev) => ({ 
          ...prev, 
          metaTitle: response.data.seo.metaTitle,
          metaDescription: response.data.seo.metaDescription,
          keywords: response.data.seo.keywords,
          altText: response.data.seo.altText
        }));
        toast.success("SEO metadata generated!");
      }
    } catch (error) {
      console.error("Failed to generate SEO:", error);
      toast.error("Failed to generate SEO metadata");
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);
    
    // Validation
    if (!formData.title || !formData.price || !formData.categoryId) {
      console.log("Validation failed:", { title: formData.title, price: formData.price, categoryId: formData.categoryId });
      toast.error("Please fill in all required fields (Title, Price, Category)");
      return;
    }

    console.log("Validation passed, submitting...");
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("authToken");
      console.log("Token retrieved:", token ? "Yes" : "No");
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        categoryId: parseInt(formData.categoryId),
        imageUrl: formData.imageUrl || "",
        offerPercentage: 0,
        metaTitle: formData.metaTitle || "",
        metaDescription: formData.metaDescription || "",
        keywords: formData.keywords || "",
        altText: formData.altText || ""
      };

      console.log("Sending POST request to:", `${API_URL}/admin/products`);
      console.log("Product data:", productData);
      
      const response = await axios.post(
        `${API_URL}/admin/products`,
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        toast.success("Product created successfully!");
        navigate("/admin/inventory");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      console.error("Error response:", error.response?.data);
      const errorMsg = error.response?.data?.error || "Failed to create product";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <SEO
        title="Create Product - Admin Dashboard"
        description="Add a new product to inventory"
        canonical={window.location.origin + "/admin/products/new"}
      />

      <div className="dashboard-header">
        <div className="header-content">
          <button onClick={() => navigate("/admin/inventory")} className="back-btn">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Inventory
          </button>
          <h1 className="dashboard-title">Create New Product</h1>
          <p className="dashboard-subtitle">Add a new product to your inventory</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            {/* Title */}
            <div className="form-group full-width">
              <label className="form-label">
                Product Title <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Chocolate Chip Pancakes"
                required
              />
            </div>

            {/* Description with AI Generator */}
            <div className="form-group full-width">
              <div className="label-with-button">
                <label className="form-label">Description</label>
                <button
                  type="button"
                  className="btn-ai"
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDescription || !formData.title}
                  title="Generate AI description"
                >
                  <FontAwesomeIcon icon={faMagic} spin={isGeneratingDescription} />
                  {isGeneratingDescription ? " Generating..." : " AI Generate"}
                </button>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Describe your product..."
                rows="5"
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <label className="form-label">
                Price (₨) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Stock */}
            <div className="form-group">
              <label className="form-label">
                Stock Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="form-input"
                placeholder="0"
                min="0"
                required
              />
            </div>

            {/* Category with Create Option */}
            <div className="form-group full-width">
              <label className="form-label">
                Category <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="create-new" className="create-option">
                    <FontAwesomeIcon icon={faPlus} /> Create New Category
                  </option>
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div className="form-group full-width">
              <label className="form-label">
                Product Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <div className="image-preview">
                  <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
                </div>
              )}
            </div>

            {/* SEO Metadata Section */}
            <div className="form-group full-width" style={{ marginTop: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  SEO Metadata <span style={{ fontSize: "0.85rem", color: "#666" }}>(Optional)</span>
                </label>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleGenerateSEO}
                  disabled={isGeneratingSEO || !formData.title}
                  style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
                >
                  <FontAwesomeIcon icon={faMagic} style={{ marginRight: "8px" }} />
                  {isGeneratingSEO ? "Generating..." : "Generate SEO Metadata"}
                </button>
              </div>

              {/* Meta Title */}
              <div className="form-group">
                <label className="form-label">
                  Meta Title 
                  <span style={{ fontSize: "0.85rem", color: "#666", marginLeft: "8px" }}>
                    ({formData.metaTitle.length}/60 characters)
                  </span>
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="SEO-optimized title for search engines"
                  maxLength="60"
                />
              </div>

              {/* Meta Description */}
              <div className="form-group">
                <label className="form-label">
                  Meta Description
                  <span style={{ fontSize: "0.85rem", color: "#666", marginLeft: "8px" }}>
                    ({formData.metaDescription.length}/160 characters)
                  </span>
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Brief description for search engine results"
                  maxLength="160"
                  rows="3"
                />
              </div>

              {/* Keywords */}
              <div className="form-group">
                <label className="form-label">Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="keyword1, keyword2, keyword3 (comma-separated)"
                />
              </div>

              {/* Alt Text */}
              <div className="form-group">
                <label className="form-label">
                  Image Alt Text
                  <span style={{ fontSize: "0.85rem", color: "#666", marginLeft: "8px" }}>
                    ({formData.altText.length}/125 characters)
                  </span>
                </label>
                <input
                  type="text"
                  name="altText"
                  value={formData.altText}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Descriptive alt text for product image"
                  maxLength="125"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/admin/inventory")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Category Creation Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleCategorySave}
      />
    </div>
  );
}

export { CreateProduct };
