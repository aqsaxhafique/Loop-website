const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Generate JWT Token
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || 'your-secret-key-change-this',
    { expiresIn: '7d' }
  );
};

// SIGNUP
const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, phone, role, created_at`,
      [email, passwordHash, firstName, lastName, phone || null, 'customer']
    );

    const user = result.rows[0];

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// GET USER PROFILE
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware

    const result = await pool.query(
      `SELECT id, email, first_name, last_name, phone, role, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// NEW: OpenAI Chat Completion Endpoint (Added under Auth Controller)
const askOpenAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question'
      });
    }

    const { OpenAI } = require('openai');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Give short, clear and friendly descriptions.'
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const answer = completion.choices[0].message.content.trim();

    res.json({
      success: true,
      answer
    });

  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get answer from OpenAI',
      error: error.message
    });
  }
};

// Generate SEO metadata using OpenAI
const generateSEO = async (req, res) => {
  try {
    const { productTitle, description, category } = req.body;

    if (!productTitle) {
      return res.status(400).json({
        success: false,
        message: 'Product title is required'
      });
    }

    const { OpenAI } = require('openai');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Generate SEO metadata for a bakery product:
Product: ${productTitle}
Description: ${description || 'N/A'}
Category: ${category || 'bakery item'}

Please provide:
1. Meta Title (50-60 characters, SEO-optimized)
2. Meta Description (150-160 characters, compelling and keyword-rich)
3. Keywords (5-8 relevant keywords, comma-separated)
4. Alt Text (short description for images, 10-15 words)

Format your response as JSON:
{
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": "...",
  "altText": "..."
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert specializing in e-commerce and bakery products. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Extract JSON from response (handle cases where AI adds markdown)
    let seoData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      seoData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      throw new Error('AI returned invalid format');
    }

    res.json({
      success: true,
      seo: {
        metaTitle: seoData.metaTitle || productTitle,
        metaDescription: seoData.metaDescription || '',
        keywords: seoData.keywords || '',
        altText: seoData.altText || productTitle
      }
    });

  } catch (error) {
    console.error('Generate SEO error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate SEO metadata',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  askOpenAI,
  generateSEO
};