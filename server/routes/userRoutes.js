const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');
// We will add middleware later for protected routes like getMe
// const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
// router.get('/me', protect, getMe); // Example of a protected route

module.exports = router;
