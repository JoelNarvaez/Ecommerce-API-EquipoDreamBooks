// --------------------------------------------------------
//  OBTENER LIBROS DESDE EL BACKEND
// --------------------------------------------------------
async function fetchBooks(page = 1, limit = 8) {
    try {
        const res = await fetch(`http://localhost:3000/api/admin/books?page=${page}&limit=${limit}`);

        if (!res.ok) throw new Error("Error al obtener libros");

        const data = await res.json();

        renderBooks(data.books);
        renderPagination(data.page, data.totalPages);

    } catch (error) {
        console.error("Error cargando libros:", error);
    }
}


// --------------------------------------------------------
//  RENDERIZAR LIBROS
// --------------------------------------------------------
function renderBooks(books = []) {
    const grid = document.getElementById("books-grid");

    if (books.length === 0) {
        grid.innerHTML = `<p style="color:#666;">No hay libros registrados.</p>`;
        return;
    }

    grid.innerHTML = "";

    books.forEach(book => {

        // Calcular precio final con oferta
        let precioFinal = book.precio;

        if (book.oferta_tipo) {
            if (book.oferta_tipo === "monto") {
                precioFinal = book.precio - book.oferta_valor;
            } else if (book.oferta_tipo === "porcentaje") {
                precioFinal = book.precio - (book.precio * (book.oferta_valor / 100));
            }
        }

        // CORRECCIÓN: URL correcta para cargar imagen
        const imagenURL = book.imagen
            ? `http://localhost:3000/uploads/${book.imagen}`
            : "/Frontend/assets/no-image.png";

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
        <div class="product-image">
            <img src="${imagenURL}" alt="${book.nombre}">
            
            <!-- Oferta arriba de la imagen -->
            ${book.oferta_tipo ? `<span class="offer-top-badge">Oferta</span>` : ""}
        </div>

        <div class="product-details">

            <!-- Título -->
            <h3>${book.nombre}</h3>

            <!-- Categoría -->
            <p class="product-category">${book.categoria || "Sin categoría"}</p>

            <!-- Precio + Oferta -->
            <div class="price-box">
                ${
                    book.oferta_tipo
                    ? `
                        <span class="old-price">$${book.precio}</span>
                        <span class="new-price">$${precioFinal.toFixed(2)}</span>

                        <div class="discount-tag">
                            ${
                                book.oferta_tipo === "monto"
                                ? `-${book.oferta_valor} MXN`
                                : `-${book.oferta_valor}%`
                            }
                        </div>
                    `
                    : `<span class="new-price">$${book.precio}</span>`
                }
            </div>

            <!-- Stock -->
            <p class="stock-status ${book.stock <= 0 ? "agotado" : "existencia"}">
                ${ book.stock <= 0 ? "Agotado" : `En existencia (${book.stock})` }
            </p>

            <!-- Autor -->
            <p class="product-desc">${book.autor}</p>

            <div class="product-actions">
                <button class="btn-action" title="Editar"><i class="bi bi-pencil-square"></i></button>
                <button class="btn-action" title="Eliminar"><i class="bi bi-trash"></i></button>
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

        if (p === currentPage) {
            btn.style.background = "#222";
        }

        btn.addEventListener("click", () => fetchBooks(p, 8));

        pagination.appendChild(btn);
    }
}

console.log("Panel Admin cargado correctamente.");
