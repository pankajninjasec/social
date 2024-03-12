const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, logoutUser , authenticateToken} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', authenticateToken , getUser);
router.post('/logout', logoutUser);

module.exports = router;
