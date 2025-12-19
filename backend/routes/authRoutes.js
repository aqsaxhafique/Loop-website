const express = require('express');
const router = express.Router();
const { simpleLogin, simpleSignup } = require('../controllers/simpleAuthController');
const { askOpenAI, generateSEO } = require('../controllers/authController');

// Simple auth routes (no password hashing - for testing only)
router.post('/signup', simpleSignup);
router.post('/login', simpleLogin);

// OpenAI endpoints
router.post('/ask', askOpenAI);
router.post('/generate-seo', generateSEO);

module.exports = router;