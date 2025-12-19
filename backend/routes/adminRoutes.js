const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');

// Dashboard analytics
router.get('/admin/analytics', auth, isAdmin, adminController.getDashboardAnalytics);

// Product management
router.post('/admin/products', auth, isAdmin, productController.createProduct);
router.put('/admin/products/:productId', auth, isAdmin, productController.updateProduct);
router.delete('/admin/products/:productId', auth, isAdmin, productController.deleteProduct);

// Order management
router.get('/admin/orders', auth, isAdmin, adminController.getAllOrders);
router.put('/admin/orders/:orderId/status', auth, isAdmin, adminController.updateOrderStatus);

module.exports = router;
