const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getAllCategories,
  getProductById,
  getProductsByCategory
} = require('../controllers/productController');

// Public routes
router.get('/products', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/products/:id', getProductById);
router.get('/categories/:categoryId/products', getProductsByCategory);

module.exports = router;
