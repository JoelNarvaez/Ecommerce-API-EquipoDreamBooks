const express = require('express');
const router = express.Router();

const { login } = require('../controllers/auth.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');


router.post('/login', verifyToken, login);

// router.get('/validate-token', verifyToken, authController.validateToken);

// router.post('/logout', verifyToken, authController.logout);

module.exports = router;
