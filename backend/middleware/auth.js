const jwt = require('jsonwebtoken');

// Verify JWT Token
const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization') || req.headers.authorization;
    console.log('Auth header received:', authHeader);
    
    const token = authHeader ? authHeader.replace('Bearer ', '').trim() : null;
    console.log('Token extracted:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Authorization denied.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key-change-this'
    );

    console.log('Token decoded successfully for user:', decoded.email, 'role:', decoded.role);

    // Add user data to request
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);
    console.error('Token that failed:', req.header('Authorization'));
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

module.exports = {
  auth,
  isAdmin
};
