const express = require("express");
const router = express.Router();

const { login } = require("../controllers/auth/login.controller.js");
const { verifyCaptcha } = require("../middlewares/captcha.middleware.js");
const { registrarUsuario } = require("../controllers/auth/register.controller");
const { verificarUsuario } = require("../controllers/auth/verify.controller");
const { forgotPassword } = require("../controllers/auth/forgot-password.controller.js");
const { verifyResetToken } = require("../controllers/auth/verifyResetToken.controller.js");
const { resetPassword } = require("../controllers/auth/reset-password.controller");

router.post("/login", verifyCaptcha, login);

router.post("/register", registrarUsuario);


router.get("/verify/:token", verificarUsuario);

router.post("/forgot-password", forgotPassword);

router.get('/verify-reset-token/:token', verifyResetToken);

router.post("/reset-password/:token", resetPassword);


module.exports = router;
