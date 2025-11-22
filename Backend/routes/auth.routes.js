// routes/auth.routes.js

// 1. Importar Express
const express = require('express');
const router = express.Router();

// 2. Importar el controlador con toda la lógica
const authController = require('../controllers/auth.controller.js');

// 3. Si tienes middleware de autenticación, importarlo también
const authMiddleware = require('../middleware/auth.middleware.js');

// POST /auth/register
// Registra un usuario nuevo con validaciones y guardado de contraseña
router.post('/auth/register', authController.register);

// POST /auth/login
// Valida credenciales, captcha, intentos fallidos y genera JWT
router.post('/auth/login', authController.login);

// POST /auth/forgot-password
// Envía correo con token de recuperación
router.post('/auth/forgot-password', authController.forgotPassword);

// POST /auth/reset-password
// Cambia contraseña utilizando token enviado por correo
router.post('/auth/reset-password', authController.resetPassword);

// GET /auth/captcha
// Genera un captcha en imagen para el usuario
router.get('/auth/captcha', authController.generateCaptcha);

// POST /auth/validate-captcha
// Valida el captcha enviado desde el frontend
router.post('/auth/validate-captcha', authController.validateCaptcha);

// POST /auth/logout
// Cierra la sesión del usuario autenticado
router.post('/auth/logout', authMiddleware.verifyToken, authController.logout);

module.exports = router;
