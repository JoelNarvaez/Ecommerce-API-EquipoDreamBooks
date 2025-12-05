console.log("detalle-libro.js cargado ✔");

let categoriaActual = null; 
let idActual = null;

async function cargarLibro() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    idActual = id;

    if (!id) {
        document.body.innerHTML = "<h2>Error: No se recibió ID del libro.</h2>";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/products/book/${id}`);
        const data = await res.json();

        if (!data.ok || !data.libro) {
            document.body.innerHTML = "<h2>Libro no encontrado</h2>";
            return;
        }

        const libro = data.libro;
        console.log("📚 Datos recibidos:", data);

        categoriaActual = libro.categoria;

        // ======================
        // IMAGEN
        // ======================
        document.getElementById("img-libro").src = libro.imagen
            ? `http://localhost:3000/uploads/${libro.imagen}`
            : "/Frontend/assets/no-image.png";

        // ======================
        // TEXTO
        // ======================
        document.getElementById("titulo").textContent = libro.nombre;
        document.getElementById("autor").textContent = libro.autor;
        document.getElementById("editorial").textContent = libro.editorial;
        document.getElementById("descripcion").textContent = libro.descripcion;
        document.getElementById("categoria").textContent = libro.categoria;
        document.getElementById("tipo").textContent = libro.tipo_de_libro;
        document.getElementById("paginas").textContent = libro.paginas;

        // ======================
        // PRECIO / OFERTA
        // ======================
        const contPrecio = document.getElementById("precioBox");
        const precio = Number(libro.precio);
        const tieneOferta = libro.oferta_tipo && libro.oferta_valor;
        const precioFinal = tieneOferta
            ? (libro.oferta_tipo === "porcentaje"
                ? precio - precio * (libro.oferta_valor / 100)
                : precio - libro.oferta_valor)
            : precio;

        contPrecio.innerHTML = tieneOferta
            ? `<span class="precio-original">$${precio.toFixed(2)}</span>
               <span class="precio-oferta">$${precioFinal.toFixed(2)}</span>`
            : `<span class="precio-normal">$${precio.toFixed(2)}</span>`;

        // ======================
        // STOCK
        // ======================
        document.getElementById("stock").innerHTML =
            libro.stock > 0
                ? `<span class="stock-disponible">Disponible (${libro.stock})</span>`
                : `<span class="stock-agotado">Agotado</span>`;

        // ======================
        // CARGAR LIBROS RECOMENDADOS
        // ======================
        if (categoriaActual) {
            cargarSlider(
                `http://localhost:3000/api/products/books/categoria/${categoriaActual}`,
                "slider-recomendados",
                idActual // pasamos id para filtrar el libro actual
            );
        }

    } catch (error) {
        console.error("Error cargando libro:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarLibro);

async function cargarSlider(endpoint, contenedorId) {
    try {
        const res = await fetch(endpoint);
        const data = await res.json();

        const cont = document.getElementById(contenedorId);
        cont.innerHTML = "";

        if (!data.ok || !data.libros || data.libros.length === 0) {
            cont.innerHTML = `<p class="sin-libros">No hay libros disponibles.</p>`;
            return;
        }

        // Pintar cada libro
        data.libros.forEach(book => {
            const urlImagen = book.imagen
                ? `http://localhost:3000/uploads/${book.imagen}`
                : "/Frontend/assets/no-image.png";

            const tieneOferta = book.oferta_tipo && book.oferta_valor;
            const precioNormal = Number(book.precio);
            const precioOferta = tieneOferta
                ? (book.oferta_tipo === "porcentaje"
                    ? precioNormal - precioNormal * (book.oferta_valor / 100)
                    : precioNormal - book.oferta_valor
                  ).toFixed(2)
                : precioNormal.toFixed(2);

            const card = document.createElement("div");
            card.classList.add("product-card", "card-slider");

            card.innerHTML = `
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
                ? `<span class="precio-original">$${precioNormal.toFixed(2)}</span>
                   <span class="precio-oferta">$${precioOferta}</span>`
                : `<span class="precio-normal">$${precioNormal.toFixed(2)}</span>`
            }
        </div>

        <p class="${book.stock > 0 ? "stock-disponible" : "stock-agotado"}">
            ${book.stock > 0 ? `Disponible (${book.stock})` : "Agotado"}
        </p>

        <div class="card-actions">

            <button class="btn-card wishlist-btn"
                onclick="event.stopPropagation(); agregarWishlist(${book.id})">
                <i class="fa-regular fa-heart"></i>
            </button>

            <button class="btn-card cart-btn"
                onclick="event.stopPropagation(); agregarCarrito(${book.id})">
                <i class="fa-solid fa-cart-shopping"></i>
            </button>

            <button class="btn-card buy-btn"
                onclick="event.stopPropagation(); comprarAhora(${book.id})">
                <i class="fa-solid fa-money-check-dollar"></i>
            </button>

        </div>
    </div>
`;


            card.addEventListener("click", () => {
                window.location.href = `/Frontend/pages/detalle-libro.html?id=${book.id}`;
            });

            cont.appendChild(card);
        });

        // Asignar scroll a las flechas después de cargar el slider
        const buttons = document.querySelectorAll(`.slider-btn[data-target="${contenedorId}"]`);
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                const scrollAmount = 320; // ancho tarjeta + gap
                if (btn.classList.contains("left")) {
                    cont.scrollBy({ left: -scrollAmount, behavior: "smooth" });
                } else {
                    cont.scrollBy({ left: scrollAmount, behavior: "smooth" });
                }
            });
        });

    } catch (error) {
        console.error("Error en cargarSlider:", error);
    }
}


// ============================
// SLIDERS GENERALES
// ============================
cargarSlider("http://localhost:3000/api/products/books/novedades", "slider-novedades");
cargarSlider("http://localhost:3000/api/products/books/ofertas", "slider-ofertas");
