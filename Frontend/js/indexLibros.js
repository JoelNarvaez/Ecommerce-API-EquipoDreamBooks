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

        data.libros.forEach(book => {

            const urlImagen = book.imagen
                ? `http://localhost:3000/uploads/${book.imagen}`
                : "/Frontend/assets/no-image.png";

            const tieneOferta = book.oferta_tipo && book.oferta_valor;
            const precioNormal = Number(book.precio);
            
            const precioOferta = tieneOferta
                ? (precioNormal - (
                    book.oferta_tipo === "porcentaje"
                        ? precioNormal * (book.oferta_valor / 100)
                        : book.oferta_valor
                )).toFixed(2)
                : precioNormal.toFixed(2);

            cont.innerHTML += `
            <a href="/Frontend/pages/detalle-libro.html?id=${book.id}" class="link-card">
                <div class="product-card card-slider">

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
                                    <span class="precio-original">$${precioNormal}</span>
                                    <span class="precio-oferta">$${precioOferta}</span>
                                  `
                                : `<span class="precio-normal">$${precioNormal}</span>`
                            }
                        </div>

                        <p class="${book.stock > 0 ? "stock-disponible" : "stock-agotado"}">
                            ${book.stock > 0 ? `Disponible (${book.stock})` : "Agotado"}
                        </p>
                    </div>

                </div>
            </a>`;
        });

    } catch (error) {
        console.error("Error en cargarSlider:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".slider-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            const slider = document.getElementById(targetId);

            // Cantidad que avanza por clic (un poco más que una tarjeta)
            const scrollAmount = 280 + 20; // ancho tarjeta + gap

            if (btn.classList.contains("left")) {
                slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        });
    });
});



// ============================
//    CARGAR DESDE EL BACKEND
// ============================
cargarSlider("http://localhost:3000/api/products/books/novedades", "slider-novedades");
cargarSlider("http://localhost:3000/api/products/books/ofertas", "slider-ofertas");
//cargarSlider("http://localhost:3000/api/books/mas-vendidos", "slider-mas-vendidos");