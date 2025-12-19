const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./config/db");

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
// const addressRoutes = require('./routes/addressRoutes');

// Routes
app.get("/", (req, res) => {
  res.send("Loop Website Backend Running");
});

app.get("/test-db", async (req, res) => {
  let client;
  try {
    // Get a client from the pool
    client = await pool.connect();
    
    // Run query
    const result = await client.query("SELECT NOW() as time, version() as version");
    
    res.json({ 
      success: true, 
      data: result.rows[0],
      message: "Database connected successfully!"
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code 
    });
  } finally {
    // Always release the client back to the pool
    if (client) {
      client.release();
    }
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminRoutes);
// app.use('/api', addressRoutes);

// Temporary route to generate password hashes (remove in production)
app.get('/generate-hash/:password', async (req, res) => {
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash(req.params.password, 10);
  res.json({ password: req.params.password, hash });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
