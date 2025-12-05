// --------------------------------------------------------
//  OBTENER LIBROS DESDE EL BACKEND (CON FILTROS)
// --------------------------------------------------------
async function fetchBooks(page = 1, limit = 10) {
  try {
    const token = localStorage.getItem("token");

    const searchText = document.getElementById("search-books").value || "";
    const categoria = document.getElementById("filter-category")?.value || "";

    const res = await fetch(
      `http://localhost:3000/api/admin/books?page=${page}&limit=${limit}&search=${searchText}&categoria=${categoria}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Error al obtener libros");

    const data = await res.json();

    renderBooks(data.books);
    renderPagination(data.page, data.totalPages);

  } catch (error) {
    console.error("Error cargando libros:", error);
  }
}

// --------------------------------------------------------
//  RENDERIZAR LIBROS (ACTUALIZADO)
// --------------------------------------------------------
function renderBooks(books = []) {
  const grid = document.getElementById("books-grid");

  if (books.length === 0) {
    grid.innerHTML = `<p style="color:#666;">No hay libros registrados.</p>`;
    return;
  }

  grid.innerHTML = "";

  books.forEach((book) => {
    let precioFinal = book.precio;

    if (book.oferta_tipo) {
      if (book.oferta_tipo === "monto") {
        precioFinal = book.precio - book.oferta_valor;
      } else if (book.oferta_tipo === "porcentaje") {
        precioFinal = book.precio - book.precio * (book.oferta_valor / 100);
      }
    }

    const imagenURL = book.imagen
      ? `http://localhost:3000/uploads/${book.imagen}`
      : `/Frontend/assets/no-image.png`;

    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-image">
          <img src="${imagenURL}" alt="${book.nombre}">
          ${book.oferta_tipo ? `<span class="offer-top-badge">Oferta</span>` : ""}
      </div>

      <div class="product-details">
          <h3>${book.nombre}</h3>
          <p class="product-category">${book.categoria}</p>

          <div class="price-box">
              ${
                book.oferta_tipo
                  ? `
                      <span class="old-price">$${book.precio}</span>
                      <span class="new-price">$${precioFinal.toFixed(2)}</span>
                      <div class="discount-tag">
                          ${book.oferta_tipo === "monto"
                            ? `-${book.oferta_valor} MXN`
                            : `-${book.oferta_valor}%` }
                      </div>
                    `
                  : `<span class="new-price">$${book.precio}</span>`
              }
          </div>

          <p class="stock-status ${book.stock <= 0 ? "agotado" : "existencia"}">
              ${book.stock <= 0 ? "Agotado" : `En existencia (${book.stock})`}
          </p>

          <p class="product-desc"><b>Autor:</b> ${book.autor}</p>
          <p class="product-desc"><b>Editorial:</b> ${book.editorial}</p>
          <p class="product-desc"><b>Tipo:</b> ${book.tipo_de_libro}</p>
          <p class="product-desc"><b>Páginas:</b> ${book.paginas}</p>

          <div class="product-actions">
              <button class="btn-action" title="Editar">
                  <i class="bi bi-pencil-square"></i>
              </button>

              <button class="btn-action btn-eliminar" data-id="${book.id}" title="Eliminar">
                  <i class="bi bi-trash"></i>
              </button>
          </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// --------------------------------------------------------
//  PAGINACIÓN
// --------------------------------------------------------
function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let p = 1; p <= totalPages; p++) {
    const btn = document.createElement("button");
    btn.textContent = p;
    btn.className = "btn btn-primary";
    btn.style.margin = "5px";

    if (p === currentPage) btn.style.background = "#222";

    btn.addEventListener("click", () => fetchBooks(p, 10));

    pagination.appendChild(btn);
  }
}


// --------------------------------------------------------
//  CARGAR CATEGORÍAS DINÁMICAMENTE DESDE EL BACKEND
// --------------------------------------------------------
async function cargarCategoriasSelect() {
  try {
    const res = await fetch("http://localhost:3000/api/products/categorias");
    const data = await res.json();

    if (!data.ok) return;

    const select = document.getElementById("filter-category");
    if (!select) return;

    // Reiniciar select
    select.innerHTML = `
      <option value="">Todas</option>
      <option value="oferta">Ofertas</option>   <!-- 🔥 AGREGADO -->
    `;

    // Categorías desde la BD
    data.categorias.forEach(cat => {
      select.innerHTML += `
        <option value="${cat}">${cat}</option>
      `;
    });

  } catch (error) {
    console.error("Error cargando categorías:", error);
  }
}



// --------------------------------------------------------
//  EVENTOS
// --------------------------------------------------------
document.getElementById("search-books")
  .addEventListener("input", () => fetchBooks(1, 10));

document.getElementById("filter-category")
  ?.addEventListener("change", () => fetchBooks(1, 10));

console.log("Panel Admin cargado correctamente.");