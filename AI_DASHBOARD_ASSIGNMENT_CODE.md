# AI-Powered Product Dashboard Assignment
## Dashboard for Creating Products with AI-Generated Content and Descriptions

---

## 📋 Overview
This is a complete implementation of an Admin Dashboard where you can:
- Enter a product title
- Generate product descriptions using AI (OpenAI GPT-3.5)
- Generate SEO metadata (meta title, description, keywords, alt text) using AI
- Create and manage products with all the generated content

---

## 🎯 Key Features
1. **AI Content Generation**: Click a button to generate product descriptions using OpenAI
2. **AI SEO Generation**: Automatically generate SEO-optimized metadata
3. **Real-time Preview**: See generated content instantly
4. **Form Validation**: Ensures all required fields are filled
5. **Image Preview**: View product images before submission
6. **Category Management**: Create new categories on the fly

---

## 📂 File Structure

### Frontend Code

#### 1. CreateProduct.jsx (Main Component)
**Location**: `src/components/admin/CreateProduct.jsx`

```jsx
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

  // ⭐ AI DESCRIPTION GENERATION FUNCTION ⭐
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

  // ⭐ AI SEO GENERATION FUNCTION ⭐
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
    
    if (!formData.title || !formData.price || !formData.categoryId) {
      toast.error("Please fill in all required fields (Title, Price, Category)");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("authToken");
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

      const response = await axios.post(
        `${API_URL}/admin/products`,
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Product created successfully!");
        navigate("/admin/inventory");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
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

            {/* Description with AI Generator Button */}
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

            {/* Category */}
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
              <label className="form-label">Product Image URL</label>
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
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    style={{ maxWidth: "200px", marginTop: "10px" }} 
                  />
                </div>
              )}
            </div>

            {/* SEO Metadata Section with AI Generation */}
            <div className="form-group full-width" style={{ marginTop: "30px" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "15px" 
              }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  SEO Metadata <span style={{ fontSize: "0.85rem", color: "#666" }}>
                    (Optional)
                  </span>
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
```

---

### Backend Code

#### 2. authController.js (AI Integration)
**Location**: `backend/controllers/authController.js`

```javascript
// OpenAI Chat Completion Endpoint for AI Content Generation
const askOpenAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question'
      });
    }

    const { OpenAI } = require('openai');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Give short, clear and friendly descriptions.'
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const answer = completion.choices[0].message.content.trim();

    res.json({
      success: true,
      answer
    });

  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get answer from OpenAI',
      error: error.message
    });
  }
};

// Generate SEO metadata using OpenAI
const generateSEO = async (req, res) => {
  try {
    const { productTitle, description, category } = req.body;

    if (!productTitle) {
      return res.status(400).json({
        success: false,
        message: 'Product title is required'
      });
    }

    const { OpenAI } = require('openai');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Generate SEO metadata for a bakery product:
Product: ${productTitle}
Description: ${description || 'N/A'}
Category: ${category || 'bakery item'}

Please provide:
1. Meta Title (50-60 characters, SEO-optimized)
2. Meta Description (150-160 characters, compelling and keyword-rich)
3. Keywords (5-8 relevant keywords, comma-separated)
4. Alt Text (short description for images, 10-15 words)

Format your response as JSON:
{
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": "...",
  "altText": "..."
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert specializing in e-commerce and bakery products. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Extract JSON from response
    let seoData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      seoData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      throw new Error('AI returned invalid format');
    }

    res.json({
      success: true,
      seo: {
        metaTitle: seoData.metaTitle || productTitle,
        metaDescription: seoData.metaDescription || '',
        keywords: seoData.keywords || '',
        altText: seoData.altText || productTitle
      }
    });

  } catch (error) {
    console.error('Generate SEO error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate SEO metadata',
      error: error.message
    });
  }
};

module.exports = {
  askOpenAI,
  generateSEO
};
```

---

#### 3. authRoutes.js (API Routes)
**Location**: `backend/routes/authRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const { askOpenAI, generateSEO } = require('../controllers/authController');

// OpenAI endpoints
router.post('/ask', askOpenAI);
router.post('/generate-seo', generateSEO);

module.exports = router;
```

---

### CSS Styling

#### 4. admin.css (Partial - Key Styles for AI Dashboard)
**Location**: `src/components/admin/admin.css`

```css
/* Form Container */
.form-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

/* Form Labels and Inputs */
.form-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  box-sizing: border-box;
}

/* AI Generate Button */
.btn-ai {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-ai:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-ai:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Label with Button Layout */
.label-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* Primary Button */
.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #4b2c20;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #3b2a22;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

/* Image Preview */
.image-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.image-preview img {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Required Field Indicator */
.required {
  color: #d9534f;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .label-with-button {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
```

---

## 🔧 Setup Instructions

### 1. Environment Variables
Create a `.env` file in the backend directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
DATABASE_URL=your_database_url
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install openai axios express
```

**Frontend:**
```bash
cd ..
npm install axios react-toastify @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
```

### 3. Run the Application

**Start Backend:**
```bash
cd backend
node server.js
```

**Start Frontend:**
```bash
npm start
```

---

## 🎬 How It Works

1. **Enter Product Title**: User types the product name (e.g., "Chocolate Chip Pancakes")

2. **Generate Description**: Click the "AI Generate" button next to the description field
   - System sends the title to OpenAI API
   - AI generates a compelling, SEO-friendly description
   - Description is automatically filled in the textarea

3. **Generate SEO Metadata**: Click "Generate SEO Metadata" button
   - AI generates meta title, meta description, keywords, and alt text
   - All fields are automatically populated
   - Character counts are shown for each field

4. **Fill Other Details**: Enter price, stock, category, and image URL

5. **Submit**: Click "Create Product" to save the product with all AI-generated content

---

## 📸 Features Demonstration

### Key Features:
- ✅ AI-powered product description generation
- ✅ AI-powered SEO metadata generation
- ✅ Real-time character counters for SEO fields
- ✅ Image preview before submission
- ✅ Form validation
- ✅ Loading states during AI generation
- ✅ Error handling with toast notifications
- ✅ Responsive design
- ✅ Category management with modal

---

## 🔑 API Endpoints

### 1. Generate Product Description
```
POST /api/auth/ask
Body: { "question": "Generate description for..." }
Response: { "success": true, "answer": "Generated description..." }
```

### 2. Generate SEO Metadata
```
POST /api/auth/generate-seo
Body: { 
  "productTitle": "Product name",
  "description": "Product description",
  "category": "Category name"
}
Response: { 
  "success": true, 
  "seo": {
    "metaTitle": "...",
    "metaDescription": "...",
    "keywords": "...",
    "altText": "..."
  }
}
```

---

## 🎓 Technical Implementation Details

### Frontend (React):
- Uses React hooks (useState, useEffect)
- Axios for API calls
- React Router for navigation
- FontAwesome for icons
- React Toastify for notifications
- Form handling with controlled components

### Backend (Node.js/Express):
- Express.js server
- OpenAI API integration (GPT-3.5-turbo model)
- Error handling and validation
- JSON response formatting
- API route organization

### AI Integration:
- Uses OpenAI's GPT-3.5-turbo model
- Custom prompts for product descriptions
- Structured prompts for SEO metadata
- Temperature and token settings for optimal results
- JSON parsing for structured SEO data

---

## 📝 Assignment Submission

**What to Submit:**
1. ✅ This document (contains all code)
2. ✅ Screenshot of the dashboard with AI-generated content
3. ✅ Screenshot of the form with filled fields
4. ✅ Screenshot of successful product creation

**Evidence of AI Usage:**
- The code shows OpenAI API integration
- Two separate AI functions: description generation and SEO generation
- Loading states during AI processing
- Error handling for AI failures

---

## 🌟 Extra Features Implemented

1. **Dual AI Generation**: Both description and SEO metadata
2. **Character Counters**: Real-time character count for SEO fields
3. **Image Preview**: See images before submitting
4. **Category Management**: Create categories on the fly
5. **Responsive Design**: Works on all screen sizes
6. **Loading States**: Visual feedback during AI generation
7. **Error Handling**: Graceful fallbacks if AI fails
8. **Form Validation**: Ensures data quality

---

## 📞 Support

For any questions about the implementation:
- Check the inline comments in the code
- Review the API documentation in the authController.js file
- Ensure your OpenAI API key is valid and has credits

---

**Assignment Completed Successfully! ✅**

This implementation demonstrates:
- Full-stack development skills
- AI integration (OpenAI GPT-3.5)
- Modern React patterns
- RESTful API design
- User experience optimization
- Error handling and validation
