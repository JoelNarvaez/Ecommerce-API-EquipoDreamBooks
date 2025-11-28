// Campos del formulario
const titleInput = document.getElementById("modal-title");
const authorInput = document.getElementById("modal-author");
const priceInput = document.getElementById("modal-price");
const stockInput = document.getElementById("modal-stock");
const descInput = document.getElementById("modal-desc");
const imageInput = document.getElementById("modal-image");

// Campos de previsualización
const previewTitle = document.getElementById("preview-title");
const previewAuthor = document.getElementById("preview-author");
const previewPrice = document.getElementById("preview-price");
const previewStock = document.getElementById("preview-stock");
const previewDesc = document.getElementById("preview-desc");
const previewImage = document.getElementById("preview-image");

// 🔵 Actualizar título
titleInput.addEventListener("input", () => {
  previewTitle.textContent = titleInput.value || "Título del libro";
});

// 🔵 Actualizar autor
authorInput.addEventListener("input", () => {
  previewAuthor.textContent = authorInput.value || "Autor";
});

// 🔵 Actualizar precio
priceInput.addEventListener("input", () => {
  const value = parseFloat(priceInput.value);
  previewPrice.textContent = value ? `$${value.toFixed(2)}` : "$0.00";
});

// 🔵 Actualizar stock
stockInput.addEventListener("input", () => {
  const stock = parseInt(stockInput.value);

  if (!isNaN(stock)) {
    previewStock.textContent =
      stock > 0 ? `En existencia (${stock})` : "Agotado";
    previewStock.style.color = stock > 0 ? "green" : "red";
  } else {
    previewStock.textContent = "En existencia (0)";
  }
});

const categoryInput = document.getElementById("modal-category");
const previewCategory = document.getElementById("preview-category");

categoryInput.addEventListener("input", () => {
  previewCategory.textContent = categoryInput.value || "Categoría";
});

// 🔵 Actualizar descripción
descInput.addEventListener("input", () => {
  previewDesc.textContent = descInput.value || "Descripción del libro…";
});

// 🔵 Previsualizar imagen
imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    previewImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
});
