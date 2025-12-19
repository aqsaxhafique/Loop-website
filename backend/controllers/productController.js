const pool = require('../config/db');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_available = true
      ORDER BY p.created_at DESC
    `);
    
    res.json({
      success: true,
      products: result.rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_available = true
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    
    res.json({
      success: true,
      categories: result.rows
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get single product by ID or slug
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 OR p.slug = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (c.id = $1 OR c.slug = $1) AND p.is_available = true
      ORDER BY p.created_at DESC
    `, [categoryId]);
    
    res.json({
      success: true,
      products: result.rows
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Create new product (Admin)
const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, categoryId, imageUrl, offerPercentage, metaTitle, metaDescription, keywords, altText } = req.body;
    
    if (!title || !price || !categoryId) {
      return res.status(400).json({ error: 'Title, price, and category are required' });
    }

    // Validate field lengths
    if (title.length > 255) {
      return res.status(400).json({ error: 'Title must be less than 255 characters' });
    }
    if (imageUrl && imageUrl.length > 500) {
      return res.status(400).json({ error: 'Image URL must be less than 500 characters' });
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const query = `
      INSERT INTO products (category_id, title, slug, description, price, offer_percentage, stock, image_url, is_available, meta_title, meta_description, keywords, alt_text)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await pool.query(query, [
      categoryId,
      title.substring(0, 255),
      slug.substring(0, 255),
      description ? description.substring(0, 1000) : '',
      price,
      offerPercentage || 0,
      stock || 0,
      imageUrl ? imageUrl.substring(0, 500) : '',
      metaTitle ? metaTitle.substring(0, 60) : title.substring(0, 60),
      metaDescription ? metaDescription.substring(0, 160) : '',
      keywords || '',
      altText ? altText.substring(0, 125) : title
    ]);

    const product = result.rows[0];

    res.status(201).json({
      success: true,
      product: {
        id: product.id,
        categoryId: product.category_id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        offerPercentage: product.offer_percentage,
        stock: product.stock,
        imageUrl: product.image_url,
        isAvailable: product.is_available
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
    
    if (error.code === '22001') {
      return res.status(400).json({ error: 'One of the fields is too long. Please use shorter text.' });
    }
    
    res.status(500).json({ error: 'Failed to create product: ' + error.message });
  }
};

// Update product (Admin)
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, description, price, stock, categoryId, imageUrl, offerPercentage, isAvailable } = req.body;

    // Generate new slug if title changed
    let slug;
    if (title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const query = `
      UPDATE products
      SET 
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        stock = COALESCE($5, stock),
        category_id = COALESCE($6, category_id),
        image_url = COALESCE($7, image_url),
        offer_percentage = COALESCE($8, offer_percentage),
        is_available = COALESCE($9, is_available),
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `;

    const result = await pool.query(query, [
      title,
      slug,
      description,
      price,
      stock,
      categoryId,
      imageUrl,
      offerPercentage,
      isAvailable,
      productId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = result.rows[0];

    res.json({
      success: true,
      product: {
        id: product.id,
        categoryId: product.category_id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        offerPercentage: product.offer_percentage,
        stock: product.stock,
        imageUrl: product.image_url,
        isAvailable: product.is_available
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product (Admin)
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = {
  getAllProducts,
  getAllCategories,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
};
