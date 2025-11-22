require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba de verificación del captcha
app.post("/verify-captcha", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: "No token provided" });
  }

  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET,
        response: token,
      })
    );

    const data = response.data;

    // Turnstile devuelve: success, challenge_ts, hostname…

    if (data.success) {
      return res.status(200).json({ success: true, msg: "Captcha válido" });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Captcha inválido",
        errors: data["error-codes"],
      });
    }

  } catch (error) {
    console.error("Error verifying captcha:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Servidor
app.listen(3000, () => {
  console.log("Backend Turnstile escuchando en http://localhost:3000");
});
