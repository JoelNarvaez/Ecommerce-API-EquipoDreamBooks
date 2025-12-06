console.log("libros.js cargado ");

// ===========================
//   LEER CATEGORÍA DESDE URL
// ===========================
const params = new URLSearchParams(window.location.search);
const categoriaURL = params.get("categoria");

// ===========================
//   APLICAR CATEGORÍA DE URL
// ===========================
function aplicarCategoriaURL() {
  if (!categoriaURL) return;

  console.log("Categoría recibida desde URL:", categoriaURL);

  const categoriasArray = categoriaURL
    .split(",")
    .map((c) => c.trim().toLowerCase());

  document
    .querySelectorAll(".filtro-grupo ul input[type='checkbox']")
    .forEach((chk) => {
      if (categoriasArray.includes(chk.value.toLowerCase())) {
        chk.checked = true;
      }
    });
}

// ===========================
//   PETICIÓN PRINCIPAL
// ===========================
async function fetchBooks(page = 1, limit = 8) {
  try {
    const search = document.getElementById("search-books")?.value || "";
    const ordenar = document.getElementById("ordenar")?.value || "";

    const categoriasSeleccionadas = [];
    document
      .querySelectorAll(".filtro-grupo ul input[type='checkbox']")
      .forEach((chk) => {
        if (chk.checked) categoriasSeleccionadas.push(chk.value);
      });

    let categoria = categoriasSeleccionadas.join(",");
    if (categoriaURL && categoriasSeleccionadas.length === 0) {
      categoria = categoriaURL;
    }

    const min = document.getElementById("precio-min")?.value || "";
    const max = document.getElementById("precio-max")?.value || "";

    let stock = "";
    const chkDisp = document.getElementById("stock-disponible");
    const chkAgot = document.getElementById("stock-agotado");

    if (chkDisp?.checked && !chkAgot?.checked) stock = "disponible";
    else if (!chkDisp?.checked && chkAgot?.checked) stock = "agotado";

    const url =
      `http://localhost:3000/api/products/books` +
      `?page=${page}` +
      `&limit=${limit}` +
      `&search=${encodeURIComponent(search)}` +
      `&categoria=${encodeURIComponent(categoria)}` +
      `&min=${min}` +
      `&max=${max}` +
      `&stock=${stock}` +
      `&orden=${ordenar}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener libros");

    const data = await res.json();
    console.log("⬅ Datos recibidos:", data);

    renderBooks(data.books || []);
    renderPagination(data.page, data.totalPages);
  } catch (error) {
    console.error("❌ Error en fetchBooks:", error);
  }
}

// ===========================
//   RENDERIZAR LIBROS
// ===========================
function renderBooks(books = []) {
  const grid = document.getElementById("books-grid");

  if (!books || books.length === 0) {
    grid.innerHTML = `
        <div class="no-books-msg">
          <span>No se encontraron libros con los filtros aplicados.</span>
        </div>
    `;
    return;
  }

  grid.innerHTML = books
    .map((book) => {
      const urlImagen = book.imagen
        ? `http://localhost:3000/uploads/${book.imagen}`
        : "../assets/no-image.png";

      const tieneOferta = book.oferta_tipo && book.oferta_valor;
      const precio = Number(book.precio);

      const precioOferta = tieneOferta
        ? (
            precio -
            (book.oferta_tipo === "porcentaje"
              ? precio * (book.oferta_valor / 100)
              : book.oferta_valor)
          ).toFixed(2)
        : precio.toFixed(2);

      return `
<a href="../pages/detalle-libro.html?id=${book.id}" class="link-card">
    <div class="product-card">

        ${tieneOferta ? `<span class="badge-oferta">Oferta</span>` : ""}
        ${book.stock === 0 ? `<span class="badge-agotado">Agotado</span>` : ""}

        <div class="product-image">
            <img src="${urlImagen}" alt="${book.nombre}">
        </div>

        <div class="product-info">
            <h3>${book.nombre}</h3>
            <p class="autor">${book.autor}</p>
            <p class="editorial">${book.editorial}</p>

            <div class="precio">
                ${
                  tieneOferta
                    ? `
                       <span class="precio-original">$${precio}</span>
                       <span class="precio-oferta">$${precioOferta}</span>`
                    : `<span class="precio-normal">$${precio}</span>`
                }
            </div>

            <p class="${book.stock > 0 ? "stock-disponible" : "stock-agotado"}">
                ${book.stock > 0 ? `Disponible (${book.stock})` : "Agotado"}
            </p>
        </div>

        <div class="card-actions">

            <button class="btn-card wishlist-btn" data-id="${book.id}">
                <i class="fa-regular fa-heart"></i>
            </button>

            <button class="btn-card cart-btn" data-id="${book.id}">
                <i class="fa-solid fa-cart-plus"></i>
            </button>

            <button class="btn-card buy-btn" data-id="${book.id}">
                <i class="fa-solid fa-money-check-dollar"></i>
            </button>

        </div>

    </div>
</a>
`;
    })
    .join("");
}

// ===========================
//   PAGINACIÓN
// ===========================
function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  if (!totalPages || totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = "";

  if (currentPage > 1) {
    html += `<button class="page-btn" onclick="fetchBooks(${currentPage - 1})">&laquo;</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${i === currentPage ? "active" : ""}"
      onclick="fetchBooks(${i})">${i}</button>
    `;
  }

  if (currentPage < totalPages) {
    html += `<button class="page-btn" onclick="fetchBooks(${currentPage + 1})">&raquo;</button>`;
  }

  pagination.innerHTML = html;
}

// ===========================
//   EVENTOS DE FILTROS
// ===========================
function initFiltros() {
  const btnBuscar = document.getElementById("btnBuscar");
  const btnPrecio = document.getElementById("btnAplicarPrecio");
  const ordenar = document.getElementById("ordenar");
  const btnLimpiar = document.getElementById("btnLimpiarFiltros");

  if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarFiltros);
  if (btnBuscar) btnBuscar.addEventListener("click", () => fetchBooks(1, 8));
  if (btnPrecio) btnPrecio.addEventListener("click", () => fetchBooks(1, 8));
  if (ordenar) ordenar.addEventListener("change", () => fetchBooks(1, 8));

  const searchInput = document.getElementById("search-books");
  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") fetchBooks(1, 8);
    });
  }

  document
    .querySelectorAll(".filtro-grupo ul input[type='checkbox']")
    .forEach((chk) => chk.addEventListener("change", () => fetchBooks(1, 8)));

  const chkDisp = document.getElementById("stock-disponible");
  const chkAgot = document.getElementById("stock-agotado");

  if (chkDisp) chkDisp.addEventListener("change", () => fetchBooks(1, 8));
  if (chkAgot) chkAgot.addEventListener("change", () => fetchBooks(1, 8));
}

// ===========================
//   INICIALIZAR TODO
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  cargarCategorias();
  aplicarCategoriaURL();
  initFiltros();
  fetchBooks(1, 8);
});

// ===========================
//   LIMPIAR FILTROS
// ===========================
function limpiarFiltros() {
  const search = document.getElementById("search-books");
  if (search) search.value = "";

  document
    .querySelectorAll(".filtro-grupo ul input[type='checkbox']")
    .forEach((chk) => (chk.checked = false));

  document.getElementById("precio-min").value = "";
  document.getElementById("precio-max").value = "";

  document.getElementById("stock-disponible").checked = false;
  document.getElementById("stock-agotado").checked = false;

  const ordenar = document.getElementById("ordenar");
  if (ordenar) ordenar.value = "";

  window.history.replaceState({}, document.title, "libros.html");

  fetchBooks(1, 8);
}

// ===========================
//   CARGAR CATEGORÍAS
// ===========================
async function cargarCategorias() {
  try {
    const res = await fetch("http://localhost:3000/api/products/categorias");
    const data = await res.json();

    if (!data.ok) return;

    const lista = document.getElementById("lista-categorias");
    lista.innerHTML = "";

    data.categorias.forEach((cat) => {
      const id = "cat_" + cat.replace(/\s+/g, "_");

      lista.innerHTML += `
        <li>
            <label>
                <input type="checkbox" value="${cat}" id="${id}">
                ${cat}
            </label>
        </li>
      `;
    });

    aplicarCategoriaURL();

    document
      .querySelectorAll("#lista-categorias input[type='checkbox']")
      .forEach((chk) => chk.addEventListener("change", () => fetchBooks(1, 8)));
  } catch (err) {
    console.error("Error al cargar categorías", err);
  }
}

// ===========================
//   MANEJO DE BOTONES
// ===========================
document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-card")) {
    const btn = e.target.closest(".btn-card");
    e.preventDefault();
    e.stopPropagation();
    const id = Number(btn.dataset.id);

    // ======================
    // WISHLIST
    // ======================
    if (btn.classList.contains("wishlist-btn")) {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Inicia sesión",
          text: "Debes iniciar sesión para usar wishlist.",
        });
        return;
      }

      agregarAWishlist(id);
      return;
    }

    // ======================
    // CARRITO
    // ======================
    if (btn.classList.contains("cart-btn")) {
      agregarAlCarrito(id);
      return;
    }

    // ======================
    // COMPRAR AHORA
    // ======================
    if (btn.classList.contains("buy-btn")) {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Inicia sesión",
          text: "Debes iniciar sesión para comprar este libro.",
        });
        return;
      }

      window.location.href = `../pages/compra.html?id=${id}&cantidad=1`;
      return;
    }
  }
});

// ============================
//    OBTENER CARRITO
// ============================
async function obtenerCarrito() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar libros al carrito.",
      });
      return;
    }

    const carritoRes = await fetch("http://localhost:3000/api/carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const carritoData = await carritoRes.json();

    if (!carritoRes.ok) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener tu carrito.",
      });
      return;
    }

    return carritoData;
  } catch (error) {
    console.error("Error inesperado:", error);

    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: "Ocurrió un error inesperado. Intenta nuevamente.",
    });
  }
}

// ============================
//    AGREGAR AL CARRITO
// ============================
async function agregarAlCarrito(idLibro, cantidad = 1) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar libros al carrito.",
      });
      return;
    }

    const carritoData = await obtenerCarrito();
    const items = carritoData.itemsCarrito;

    const itemExistente = items.find(
      (item) => item.ProductoId === idLibro
    );

    if (itemExistente) {
      return await actualizarItemExistente(
        itemExistente,
        cantidad,
        idLibro,
        token
      );
    } else {
      return await agregarNuevoItem(idLibro, cantidad, token);
    }
  } catch (error) {
    console.error("Error inesperado:", error);
    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: `${error.message || "Ocurrió un error inesperado. Intenta nuevamente."}`,
    });
  }
}

// ============================
//   ACTUALIZAR ITEM EXISTENTE
// ============================
async function actualizarItemExistente(itemExistente, cantidad, idLibro, token) {
  const nuevaCantidad = itemExistente.Cantidad + cantidad;

  const updateRes = await fetch(
    "http://localhost:3000/api/carts/actualizar",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productoId: idLibro,   // <- CORREGIDO
        cantidad: nuevaCantidad,
      }),
    }
  );

  const updateData = await updateRes.json();

  if (!updateRes.ok) {
    Swal.fire({
      icon: "warning",
      title: "No se pudo actualizar la cantidad del libro.",
      text: `${updateData.message || ""}`,
    });
    return;
  }

  Swal.fire({
    icon: "success",
    title:
      "Se actualizó la cantidad del libro a " +
      nuevaCantidad,
    timer: 2000,
  });

  return updateData;
}

// ============================
//   AGREGAR NUEVO ITEM
// ============================
async function agregarNuevoItem(idLibro, cantidad, token) {
  const addRes = await fetch("http://localhost:3000/api/carts/agregar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productoId: idLibro,
      cantidad,
    }),
  });

  const addData = await addRes.json();

  if (!addRes.ok) {
    Swal.fire({
      icon: "error",
      title: "No se pudo agregar el libro al carrito.",
      text: addData.message || "",
    });
    return;
  }

  const items = addData.carrito;
  const itemAdded = items.find((item) => item.detalleProducto.id === idLibro);

  Swal.fire({
    icon: "success",
    title: "Libro agregado",
    text: "Se añadió al carrito correctamente.",
    timer: 2000,
  });

  return addData;
}

// ===========================================
//     AGREGAR A WISHLIST (YA FUNCIONA BIEN)
// ===========================================
async function agregarAWishlist(idLibro) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar libros a tu wishlist.",
      });
      return;
    }

    const res = await fetch(
      "http://localhost:3000/api/wishlist/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId: idLibro }),
      }
    );

    const data = await res.json();

    if (!data.ok) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "No se pudo agregar el libro a wishlist.",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Agregado a tu wishlist",
      text: "El libro fue guardado correctamente.",
      timer: 2000,
    });
  } catch (error) {
    console.error("Error wishlist:", error);
    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: "Ocurrió un error al agregar el libro a wishlist.",
    });
  }
}
