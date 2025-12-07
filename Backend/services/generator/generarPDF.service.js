const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function generarPDF(nombrePDF, contenidoHTML) {
  const outputPath = path.join(__dirname, "pdfs", nombrePDF);

  // Crear carpeta si no existe
  if (!fs.existsSync(path.join(__dirname, "pdfs"))) {
    fs.mkdirSync(path.join(__dirname, "pdfs"));
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(), // 👈 AQUÍ ESTÁ LA CORRECCIÓN
    headless: chromium.headless,
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
