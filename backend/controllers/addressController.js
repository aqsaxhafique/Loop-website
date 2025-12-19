const pool = require('../config/db');

// Get user's addresses
const getAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(`
      SELECT * FROM addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
    `, [userId]);
    
    // Transform to match frontend expectations
    const addresses = result.rows.map(addr => ({
      _id: addr.id.toString(),
      userId: addr.user_id,
      name: addr.name || '',
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.postal_code || addr.zip_code,
      country: addr.country || 'Pakistan',
      mobile: addr.mobile || addr.phone || '',
      isDefault: addr.is_default,
      createdAt: addr.created_at,
      updatedAt: addr.updated_at
    }));
    
    res.json({ success: true, addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

// Add new address
const addAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, street, city, state, zipCode, country, mobile, isDefault } = req.body;
    
    if (!street || !city || !state) {
      return res.status(400).json({ error: 'Street, city, and state are required' });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [userId]
      );
    }

    const query = `
      INSERT INTO addresses (user_id, name, street, city, state, postal_code, country, mobile, is_default)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId,
      name || '',
      street,
      city,
      state,
      zipCode || '',
      country || 'Pakistan',
      mobile || '',
      isDefault || false
    ]);

    const newAddress = result.rows[0];
    
    // Transform to frontend format
    const address = {
      _id: newAddress.id.toString(),
      userId: newAddress.user_id,
      name: newAddress.name,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      zipCode: newAddress.postal_code,
      country: newAddress.country,
      mobile: newAddress.mobile,
      isDefault: newAddress.is_default
    };

    res.status(201).json({ success: true, address });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;
    const { name, street, city, state, zipCode, country, mobile, isDefault } = req.body;
    
    // Verify address belongs to user
    const checkResult = await pool.query(
      'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
      [addressId, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2',
        [userId, addressId]
      );
    }

    const query = `
      UPDATE addresses
      SET name = $1, street = $2, city = $3, state = $4, 
          postal_code = $5, country = $6, mobile = $7, is_default = $8, updated_at = NOW()
      WHERE id = $9 AND user_id = $10
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      name || '',
      street,
      city,
      state,
      zipCode || '',
      country || 'Pakistan',
      mobile || '',
      isDefault || false,
      addressId,
      userId
    ]);

    const updatedAddress = result.rows[0];
    
    const address = {
      _id: updatedAddress.id.toString(),
      userId: updatedAddress.user_id,
      name: updatedAddress.name,
      street: updatedAddress.street,
      city: updatedAddress.city,
      state: updatedAddress.state,
      zipCode: updatedAddress.postal_code,
      country: updatedAddress.country,
      mobile: updatedAddress.mobile,
      isDefault: updatedAddress.is_default
    };

    res.json({ success: true, address });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id',
      [addressId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
