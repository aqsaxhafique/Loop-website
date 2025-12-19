const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// All cart routes require authentication
router.get('/user/cart', auth, getCart);
router.post('/user/cart', auth, addToCart);
router.post('/user/cart/:id', auth, updateCartQuantity);
router.delete('/user/cart/:id', auth, removeFromCart);
router.get('/user/cart/all', auth, clearCart);

module.exports = router;
