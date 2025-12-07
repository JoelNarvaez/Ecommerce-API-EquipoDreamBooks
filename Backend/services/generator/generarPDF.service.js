const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function generarPDF(nombrePDF, contenidoHTML) {
  const outputPath = path.join(__dirname, "pdfs", nombrePDF);

  // Crear carpeta si no existe
  if (!fs.existsSync(path.join(__dirname, "pdfs"))) {
    fs.mkdirSync(path.join(__dirname, "pdfs"));
  }

  // Lanzar navegador compatible con Railway
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  await page.setContent(contenidoHTML, { waitUntil: "networkidle0" });

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return outputPath;
}

module.exports = generarPDF;
