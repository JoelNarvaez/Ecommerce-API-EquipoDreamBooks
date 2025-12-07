const fs = require("fs");
const path = require("path");

module.exports = function getLogoBase64() {
    const imagePath = path.join(__dirname, "../../assets/public/logo-header.png");

    if (!fs.existsSync(imagePath)) {
        console.error("❌ ERROR: No se encontró el logo en:", imagePath);
        return "";
    }

    const base64 = fs.readFileSync(imagePath).toString("base64");
    return `data:image/png;base64,${base64}`;
};
