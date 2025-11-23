const axios = require("axios");

const verifyCaptcha = async (req, res, next) => {
  const { captchaToken } = req.body;

  // Validar faltante
  if (!captchaToken) {
    return res.status(400).json({
      success: false,
      error: "No captchaToken provided"
    });
  }

  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET,
        response: captchaToken
      })
    );

    const data = response.data;

    if (!data.success) {
      return res.status(400).json({
        success: false,
        msg: "Captcha inválido",
        errors: data["error-codes"]
      });
    }

    next();

  } catch (error) {
    console.error("Error verifying captcha:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

module.exports = {
  verifyCaptcha
};
