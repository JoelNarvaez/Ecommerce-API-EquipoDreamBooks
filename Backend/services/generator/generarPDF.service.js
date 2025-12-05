const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

async function generarPDF(nombrePDF, contenidoHTML) {

  const outputPath = path.join(__dirname, "pdfs", nombrePDF);

  // Asegurar que el directorio existe
  if (!fs.existsSync(path.join(__dirname, "pdfs"))) {
    fs.mkdirSync(path.join(__dirname, "pdfs"));
  }

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  

  await page.setContent(contenidoHTML, { waitUntil: "networkidle0" });

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return outputPath;
}

module.exports = generarPDF;
