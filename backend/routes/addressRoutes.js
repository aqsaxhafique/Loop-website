const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getAddresses, addAddress, updateAddress, deleteAddress } = require('../controllers/addressController');

router.get('/user/addresses', auth, getAddresses);
router.post('/user/addresses', auth, addAddress);
router.put('/user/addresses/:addressId', auth, updateAddress);
router.delete('/user/addresses/:addressId', auth, deleteAddress);

module.exports = router;
