const pool = require('../config/db');

const createOrder = async (req, res) => {
  const userId = req.user.userId;
  const { order } = req.body;

  if (!order || !order.items || order.items.length === 0) {
    return res.status(400).json({ error: 'Order items are required' });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Get address_id if deliveryAddress exists
    let addressId = null;
    if (order.deliveryAddress && order.deliveryAddress._id) {
      addressId = order.deliveryAddress._id;
    }

    // Calculate total amount
    const totalAmount = order.totalPrice || order.items.reduce((sum, item) => {
      return sum + (item.price * item.qty);
    }, 0);

    // Insert order
    const orderQuery = `
      INSERT INTO orders (user_id, address_id, order_number, total_amount, status, payment_method, payment_status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const paymentMethod = order.paymentId === 'DIRECT' ? 'COD' : 'ONLINE';
    const paymentStatus = order.paymentId === 'DIRECT' ? 'pending' : 'paid';
    
    const orderResult = await client.query(orderQuery, [
      userId,
      addressId,
      orderNumber,
      totalAmount,
      'pending',
      paymentMethod,
      paymentStatus,
      order.notes || null
    ]);

    const createdOrder = orderResult.rows[0];

    // Insert order items
    for (const item of order.items) {
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      
      const subtotal = item.price * item.qty;
      await client.query(itemQuery, [
        createdOrder.id,
        item.id,
        item.title,
        item.qty,
        item.price,
        subtotal
      ]);
    }

    // Clear user's cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    // Transform to camelCase for frontend with all expected fields
    const transformedOrder = {
      id: createdOrder.id,
      userId: createdOrder.user_id,
      addressId: createdOrder.address_id,
      orderNumber: createdOrder.order_number,
      totalAmount: createdOrder.total_amount,
      totalPrice: createdOrder.total_amount, // Frontend expects totalPrice
      status: createdOrder.status,
      paymentMethod: createdOrder.payment_method,
      paymentStatus: createdOrder.payment_status,
      paymentId: order.paymentId, // From request
      notes: createdOrder.notes,
      createdAt: createdOrder.created_at,
      updatedAt: createdOrder.updated_at,
      orderDate: createdOrder.created_at, // Frontend expects orderDate
      deliveryAddress: order.deliveryAddress, // From request
      items: order.items.map(item => ({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        qty: item.qty,
        price: item.price
      }))
    };

    res.status(201).json({ 
      success: true,
      order: transformedOrder,
      orders: [transformedOrder], // For compatibility with frontend
      message: 'Order placed successfully'
    });

  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    if (client) client.release();
  }
};

const getOrders = async (req, res) => {
  const userId = req.user.userId;

  try {
    const query = `
      SELECT 
        o.*,
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
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    // Transform to camelCase with frontend-compatible field names
    const orders = result.rows.map(order => ({
      id: order.id,
      userId: order.user_id,
      addressId: order.address_id,
      orderNumber: order.order_number,
      totalAmount: order.total_amount,
      totalPrice: order.total_amount, // Frontend expects totalPrice
      orderDate: order.created_at, // Frontend expects orderDate
      status: order.status,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      paymentId: 'DIRECT', // Default payment ID
      deliveryAddress: null, // Would need to join with addresses table
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: order.items
    }));

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getOrderById = async (req, res) => {
  const userId = req.user.userId;
  const { orderId } = req.params;

  try {
    const query = `
      SELECT 
        o.*,
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
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1 AND o.user_id = $2
      GROUP BY o.id
    `;

    const result = await pool.query(query, [orderId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];
    
    // Transform to camelCase with frontend-compatible field names
    const transformedOrder = {
      id: order.id,
      userId: order.user_id,
      addressId: order.address_id,
      orderNumber: order.order_number,
      totalAmount: order.total_amount,
      totalPrice: order.total_amount, // Frontend expects totalPrice
      orderDate: order.created_at, // Frontend expects orderDate
      status: order.status,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      paymentId: 'DIRECT', // Default payment ID
      deliveryAddress: null, // Would need to join with addresses table
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: order.items
    };

    res.json({ success: true, order: transformedOrder });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};
