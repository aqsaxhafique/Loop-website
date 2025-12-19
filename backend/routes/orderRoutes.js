const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

// All order routes require authentication
router.post('/user/orders', auth, createOrder);
router.get('/user/orders', auth, getOrders);
router.get('/user/orders/:orderId', auth, getOrderById);

module.exports = router;
