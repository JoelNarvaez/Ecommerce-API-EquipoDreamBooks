const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

async function generarPDF(nombrePDF, contenidoHTML) {

  const outputPath = path.join(__dirname, "pdfs", nombrePDF);

  // Asegurar carpeta
  const pdfDir = path.join(__dirname, "pdfs");
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
  }

  // Lanzar navegador compatible con Railway
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless, // Obligatorio para contenedores
  });

  const page = await browser.newPage();

  await page.setContent(contenidoHTML, {
    waitUntil: ["networkidle0", "load", "domcontentloaded"]
  });

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return outputPath;
}

module.exports = generarPDF;
