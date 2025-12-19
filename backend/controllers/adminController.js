const pool = require('../config/db');

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    // Get total sales (sum of all completed orders)
    const salesResult = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total_sales
      FROM orders
      WHERE payment_status = 'completed' OR status = 'completed'
    `);

    // Get total orders count
    const ordersResult = await pool.query(`
      SELECT COUNT(*) as total_orders
      FROM orders
    `);

    // Get active orders count
    const activeOrdersResult = await pool.query(`
      SELECT COUNT(*) as active_orders
      FROM orders
      WHERE status IN ('pending', 'processing')
    `);

    // Get total customers count
    const customersResult = await pool.query(`
      SELECT COUNT(*) as total_customers
      FROM users
      WHERE role = 'customer'
    `);

    // Get low stock items (stock < 10)
    const lowStockResult = await pool.query(`
      SELECT COUNT(*) as low_stock_items
      FROM products
      WHERE stock < 10 AND is_available = true
    `);

    // Get recent orders
    const recentOrdersResult = await pool.query(`
      SELECT o.id, o.order_number, o.total_amount, o.status, o.created_at,
             u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    // Get sales data for last 7 days
    const salesChartResult = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as daily_sales
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      analytics: {
        totalSales: parseFloat(salesResult.rows[0].total_sales).toFixed(2),
        totalOrders: parseInt(ordersResult.rows[0].total_orders),
        activeOrders: parseInt(activeOrdersResult.rows[0].active_orders),
        totalCustomers: parseInt(customersResult.rows[0].total_customers),
        lowStockItems: parseInt(lowStockResult.rows[0].low_stock_items),
        recentOrders: recentOrdersResult.rows.map(order => ({
          id: order.id,
          orderNumber: order.order_number,
          totalAmount: parseFloat(order.total_amount),
          status: order.status,
          customerEmail: order.customer_email,
          createdAt: order.created_at
        })),
        salesChart: salesChartResult.rows.map(day => ({
          date: day.date,
          orderCount: parseInt(day.order_count),
          dailySales: parseFloat(day.daily_sales)
        }))
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Get all orders for admin
const getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT 
        o.*,
        u.email as customer_email,
        u.id as customer_id,
        json_agg(
          json_build_object(
            'id', oi.product_id,
            'title', oi.product_name,
            'imageUrl', COALESCE(p.image_url, ''),
            'qty', oi.quantity,
            'price', oi.price,
            'subtotal', oi.subtotal
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id, u.email, u.id
      ORDER BY o.created_at DESC
    `;

    const result = await pool.query(query);

    const orders = result.rows.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      customerId: order.customer_id,
      customerEmail: order.customer_email,
      totalAmount: parseFloat(order.total_amount),
      status: order.status,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
      items: order.items
    }));

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const query = `
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

module.exports = {
  getDashboardAnalytics,
  getAllOrders,
  updateOrderStatus
};
