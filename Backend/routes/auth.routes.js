const express = require('express');
const router = express.Router();

const { login } = require('../controllers/auth/login.controller.js');
const { verifyCaptcha } = require('../middlewares/captcha.middleware.js');
const { registrarUsuario } = require("../controllers/auth/register.controller");


router.post("/login", verifyCaptcha , login);
router.post("/register", registrarUsuario);

// router.get('/validate-token', verifyToken, authController.validateToken);

// router.post('/logout', verifyToken, authController.logout);

module.exports = router;
