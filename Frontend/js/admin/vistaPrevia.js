// // Campos del formulario
// const titleInput = document.getElementById("modal-title");
// const authorInput = document.getElementById("modal-author");
// const priceInput = document.getElementById("modal-price");
// const stockInput = document.getElementById("modal-stock");
// const descInput = document.getElementById("modal-desc");
// const imageInput = document.getElementById("modal-image");
// const categoryInput = document.getElementById("modal-category");

// // 🔥 NUEVOS CAMPOS
// const editorialInput = document.getElementById("modal-editorial");
// const tipoInput = document.getElementById("modal-tipo");
// const paginasInput = document.getElementById("modal-paginas");

// // Campos de previsualización
// const previewTitle = document.getElementById("preview-title");
// const previewAuthor = document.getElementById("preview-author");
// const previewPrice = document.getElementById("preview-price");
// const previewStock = document.getElementById("preview-stock");
// const previewDesc = document.getElementById("preview-desc");
// const previewImage = document.getElementById("preview-image");
// const previewCategory = document.getElementById("preview-category");

// // 🔥 NUEVAS PREVIEW
// const previewEditorial = document.getElementById("preview-editorial");
// const previewTipo = document.getElementById("preview-tipo");
// const previewPaginas = document.getElementById("preview-paginas");


// // --------------------------------------------------------------
// // 🔵 Actualizar título
// // --------------------------------------------------------------
// titleInput.addEventListener("input", () => {
//   previewTitle.textContent = titleInput.value || "Título del libro";
// });

// // 🔵 Actualizar autor
// authorInput.addEventListener("input", () => {
//   previewAuthor.textContent = authorInput.value || "Autor";
// });

// // 🔵 Actualizar precio
// priceInput.addEventListener("input", () => {
//   const value = parseFloat(priceInput.value);
//   previewPrice.textContent = value ? `$${value.toFixed(2)}` : "$0.00";
// });

// // 🔵 Actualizar stock
// stockInput.addEventListener("input", () => {
//   const stock = parseInt(stockInput.value);

//   if (!isNaN(stock)) {
//     previewStock.textContent =
//       stock > 0 ? `En existencia (${stock})` : "Agotado";
//     previewStock.style.color = stock > 0 ? "green" : "red";
//   } else {
//     previewStock.textContent = "En existencia (0)";
//   }
// });

// // 🔵 Actualizar categoría
// categoryInput.addEventListener("input", () => {
//   previewCategory.textContent = categoryInput.value || "Categoría";
// });

// // 🔵 Actualizar descripción
// descInput.addEventListener("input", () => {
//   previewDesc.textContent = descInput.value || "Descripción del libro…";
// });

// // 🔵 Previsualizar imagen
// imageInput.addEventListener("change", (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   const reader = new FileReader();

//   reader.onload = (e) => {
//     previewImage.src = e.target.result;
//   };

//   reader.readAsDataURL(file);
// });


// // --------------------------------------------------------------
// //  NUEVOS CAMPOS — PREVIEW EN TIEMPO REAL
// // --------------------------------------------------------------

// // 🔵 Editorial
// editorialInput.addEventListener("input", () => {
//   previewEditorial.textContent = editorialInput.value || "Editorial";
// });

// // 🔵 Tipo de libro
// tipoInput.addEventListener("input", () => {
//   previewTipo.textContent = tipoInput.value || "Tipo de libro";
// });

// // 🔵 Número de páginas
// paginasInput.addEventListener("input", () => {
//   const num = paginasInput.value;
//   previewPaginas.textContent = num ? `${num} páginas` : "0 páginas";
// });
