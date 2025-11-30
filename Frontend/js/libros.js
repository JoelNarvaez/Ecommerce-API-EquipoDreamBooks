console.log("libros.js cargado ✅");

// ===========================
//   PETICIÓN PRINCIPAL
// ===========================
async function fetchBooks(page = 1, limit = 8) {
    try {
        const search = document.getElementById("search-books")?.value || "";
        const ordenar = document.getElementById("ordenar")?.value || "";

        // Categorías
        const categoriasSeleccionadas = [];
        document
            .querySelectorAll(".filtro-grupo ul input[type='checkbox']")
            .forEach(chk => {
                if (chk.checked) categoriasSeleccionadas.push(chk.value);
            });
        const categoria = categoriasSeleccionadas.join(",");

        // Precio
        const min = document.getElementById("precio-min")?.value || "";
        const max = document.getElementById("precio-max")?.value || "";

        // Stock
        let stock = "";
        const chkDisp = document.getElementById("stock-disponible");
        const chkAgot = document.getElementById("stock-agotado");

        if (chkDisp?.checked && !chkAgot?.checked) stock = "disponible";
        else if (!chkDisp?.checked && chkAgot?.checked) stock = "agotado";

        console.log("➡ Filtros enviados:", { page, search, categoria, min, max, stock, ordenar });

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
        console.error("Error en fetchBooks:", error);
    }
}

// ===========================
//   RENDERIZAR LIBROS
// ===========================
function renderBooks(books = []) {
    const grid = document.getElementById("books-grid");

    if (!books || books.length === 0) {
        grid.innerHTML = `<p>No hay libros disponibles.</p>`;
        return;
    }

    grid.innerHTML = books.map(book => {
        const urlImagen = book.imagen
            ? `http://localhost:3000/uploads/${book.imagen}`
            : "/Frontend/assets/no-image.png";

        const tieneOferta = book.oferta_tipo && book.oferta_valor;
        const precio = Number(book.precio);

        const precioOferta = tieneOferta
            ? (precio - (book.oferta_tipo === "porcentaje"
                ? precio * (book.oferta_valor / 100)
                : book.oferta_valor)).toFixed(2)
            : precio.toFixed(2);

        return `
        <a href="/Frontend/pages/detalle-libro.html?id=${book.id}" class="link-card">
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
                                ? `<span class="precio-original">$${precio}</span>
                                   <span class="precio-oferta">$${precioOferta}</span>`
                                : `<span class="precio-normal">$${precio}</span>`
                        }
                    </div>

                    <p class="${book.stock > 0 ? "stock-disponible" : "stock-agotado"}">
                        ${book.stock > 0 ? `Disponible (${book.stock})` : "Agotado"}
                    </p>
                </div>

            </div>
        </a>`;
    }).join("");
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

    if (btnBuscar) btnBuscar.addEventListener("click", () => fetchBooks(1, 8));
    if (btnPrecio) btnPrecio.addEventListener("click", () => fetchBooks(1, 8));

    const searchInput = document.getElementById("search-books");
    if (searchInput) {
        searchInput.addEventListener("keyup", e => {
            if (e.key === "Enter") fetchBooks(1, 8);
        });
    }

    document
        .querySelectorAll(".filtro-grupo ul input[type='checkbox']")
        .forEach(chk => chk.addEventListener("change", () => fetchBooks(1, 8)));

    const chkDisp = document.getElementById("stock-disponible");
    const chkAgot = document.getElementById("stock-agotado");

    if (chkDisp) chkDisp.addEventListener("change", () => fetchBooks(1, 8));
    if (chkAgot) chkAgot.addEventListener("change", () => fetchBooks(1, 8));

    if (ordenar) ordenar.addEventListener("change", () => fetchBooks(1, 8));
}

// ===========================
//   INICIALIZAR
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    initFiltros();
    fetchBooks(1, 8);
});
