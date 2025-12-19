const pool = require('../config/db');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(`
      SELECT c.id, c.quantity, c.created_at,
             p.id as product_id, p.title, p.slug, p.price, 
             p.image_url, p.stock, p.offer_percentage,
             (p.price * c.quantity) as subtotal
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `, [userId]);
    
    // Transform to match frontend expectations (camelCase)
    const cart = result.rows.map(item => ({
      id: item.product_id,
      cartId: item.id,
      title: item.title,
      slug: item.slug,
      price: item.price,
      imageUrl: item.image_url,
      stock: item.stock,
      offerPercentage: item.offer_percentage,
      qty: item.quantity,
      subtotal: item.subtotal
    }));
    
    res.json({
      success: true,
      cart: cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product } = req.body;
    
    if (!product || !product.id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    // Check if item already exists in cart
    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, product.id]
    );
    
    if (existingItem.rows.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2',
        [userId, product.id]
      );
    } else {
      // Insert new item
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [userId, product.id, 1]
      );
    }
    
    // Get updated cart
    const result = await pool.query(`
      SELECT c.id, c.quantity, c.created_at,
             p.id as product_id, p.title, p.slug, p.price, 
             p.image_url, p.stock, p.offer_percentage
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `, [userId]);
    
    const cart = result.rows.map(item => ({
      id: item.product_id,
      cartId: item.id,
      title: item.title,
      slug: item.slug,
      price: item.price,
      imageUrl: item.image_url,
      stock: item.stock,
      offerPercentage: item.offer_percentage,
      qty: item.quantity
    }));
    
    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      cart: cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { action } = req.body;
    
    if (action.type === 'increment') {
      await pool.query(
        'UPDATE cart SET quantity = quantity + 1 WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
    } else if (action.type === 'decrement') {
      const item = await pool.query(
        'SELECT quantity FROM cart WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      
      if (item.rows[0].quantity > 1) {
        await pool.query(
          'UPDATE cart SET quantity = quantity - 1 WHERE id = $1 AND user_id = $2',
          [id, userId]
        );
      } else {
        // Remove if quantity becomes 0
        await pool.query(
          'DELETE FROM cart WHERE id = $1 AND user_id = $2',
          [id, userId]
        );
      }
    }
    
    // Get updated cart
    const result = await pool.query(`
      SELECT c.id, c.quantity, c.created_at,
             p.id as product_id, p.title, p.slug, p.price, 
             p.image_url, p.stock, p.offer_percentage
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `, [userId]);
    
    const cart = result.rows.map(item => ({
      id: item.product_id,
      cartId: item.id,
      title: item.title,
      slug: item.slug,
      price: item.price,
      imageUrl: item.image_url,
      stock: item.stock,
      offerPercentage: item.offer_percentage,
      qty: item.quantity
    }));
    
    res.json({
      success: true,
      message: 'Cart updated',
      cart: cart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    await pool.query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    // Get updated cart
    const result = await pool.query(`
      SELECT c.id, c.quantity, c.created_at,
             p.id as product_id, p.title, p.slug, p.price, 
             p.image_url, p.stock, p.offer_percentage
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `, [userId]);
    
    const cart = result.rows.map(item => ({
      id: item.product_id,
      cartId: item.id,
      title: item.title,
      slug: item.slug,
      price: item.price,
      imageUrl: item.image_url,
      stock: item.stock,
      offerPercentage: item.offer_percentage,
      qty: item.quantity
    }));
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    
    res.json({
      success: true,
      message: 'Cart cleared successfully',
      cart: []
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
};
