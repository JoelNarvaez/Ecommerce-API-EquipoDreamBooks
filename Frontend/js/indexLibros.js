/* ============================================================
   FUNCIÓN PARA CARGAR SLIDER DESDE BACKEND
============================================================ */
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

        data.libros.forEach((book) => {
            const urlImagen = book.imagen
                ? `http://localhost:3000/uploads/${book.imagen}`
                : "/Frontend/assets/no-image.png";

            const tieneOferta = book.oferta_tipo && book.oferta_valor;
            const precioNormal = Number(book.precio);

            const precioOferta = tieneOferta
                ? (
                    precioNormal -
                    (book.oferta_tipo === "porcentaje"
                        ? precioNormal * (book.oferta_valor / 100)
                        : book.oferta_valor)
                ).toFixed(2)
                : precioNormal.toFixed(2);

            cont.innerHTML += `
                <div class="product-card card-slider">

                    <a href="/Frontend/pages/detalle-libro.html?id=${book.id}" class="link-card">
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
                                            <span class="precio-oferta">$${precioOferta}</span>`
                                        : `<span class="precio-normal">$${precioNormal}</span>`
                                }
                            </div>

                            <p class="${book.stock > 0 ? "stock-disponible" : "stock-agotado"}">
                                ${book.stock > 0 ? `Disponible (${book.stock})` : "Agotado"}
                            </p>
                        </div>
                    </a>

                    <div class="card-actions">
                        <button class="btn-card wishlist-btn" data-id="${book.id}">
                            <i class="fa-regular fa-heart"></i>
                        </button>

                        <button class="btn-card cart-btn" data-id="${book.id}">
                            <i class="fa-solid fa-cart-shopping"></i>
                        </button>

                        <button class="btn-card buy-btn" data-id="${book.id}">
                            <i class="fa-solid fa-money-check-dollar"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error en cargarSlider:", error);
    }
}


/* ============================================================
   DESPLAZAMIENTO DE SLIDERS
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".slider-btn");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            const slider = document.getElementById(targetId);

            const scrollAmount = 300;

            slider.scrollBy({
                left: btn.classList.contains("left") ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        });
    });
});


/* ============================================================
   EVENTOS EN SLIDERS
============================================================ */
document.getElementById("slider-novedades")
    .addEventListener("click", manejarClickEnSlider);

document.getElementById("slider-ofertas")
    .addEventListener("click", manejarClickEnSlider);


/* ============================================================
   FUNCIÓN UNIVERSAL PARA CLICKS EN ICONOS DEL SLIDER
============================================================ */
async function manejarClickEnSlider(e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    // --- CARRITO ---
    if (btn.classList.contains("cart-btn")) {
        await agregarAlCarrito(id);
        return;
    }

    // --- WISHLIST ---
    if (btn.classList.contains("wishlist-btn")) {
        await agregarAWishlist(id);
        return;
    }

    // --- COMPRAR AHORA ---
    if (btn.classList.contains("buy-btn")) {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Debes iniciar sesión",
                text: "Inicia sesión para realizar una compra.",
            });
            return;
        }

        window.location.href = `/Frontend/pages/compra.html?id=${id}&cantidad=1`;
        return;
    }
}


/* ============================================================
   OBTENER CARRITO
============================================================ */
async function obtenerCarrito() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Inicia sesión",
                text: "Debes iniciar sesión para agregar al carrito.",
            });
            return null;
        }

        const res = await fetch("http://localhost:3000/api/carts", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return null;

        return await res.json();
    } catch (error) {
        console.error("Error obteniendo carrito:", error);
        return null;
    }
}


/* ============================================================
   AGREGAR AL CARRITO
============================================================ */
async function agregarAlCarrito(idLibro, cantidad = 1) {
    const token = localStorage.getItem("token");

    if (!token) {
        Swal.fire({
            icon: "warning",
            title: "Inicia sesión",
            text: "Debes iniciar sesión para agregar al carrito.",
        });
        return;
    }

    const carrito = await obtenerCarrito();
    if (!carrito) return;

    const itemExistente = carrito.itemsCarrito.find(
        (item) => item.ProductoId === idLibro
    );

    if (itemExistente) {
        return await actualizarItemExistente(itemExistente, cantidad, idLibro, token);
    }

    return await agregarNuevoItem(idLibro, cantidad, token);
}


/* ============================================================
   ACTUALIZAR ITEM EXISTENTE
============================================================ */
async function actualizarItemExistente(itemExistente, cantidad, idLibro, token) {
    const nuevaCantidad = itemExistente.Cantidad + cantidad;

    const res = await fetch("http://localhost:3000/api/carts/actualizar", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId: idLibro, cantidad: nuevaCantidad }),
    });

    const data = await res.json();
    if (!res.ok) {
        Swal.fire("Error", data.message || "No se pudo actualizar.", "error");
        return;
    }

    Swal.fire("Actualizado", "Cantidad actualizada en el carrito", "success");
    return data;
}


/* ============================================================
   AGREGAR NUEVO ITEM
============================================================ */
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

  if (!addRes.ok) {
        Swal.fire("Error", data.message || "No se pudo agregar al carrito.", "error");
        return;
  }

    Swal.fire("Agregado", "Libro agregado al carrito!", "success");
    return addData;
}


/* ============================================================
   AGREGAR A WISHLIST
============================================================ */
async function agregarAWishlist(idLibro) {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Inicia sesión",
                text: "Debes iniciar sesión para usar wishlist.",
            });
            return;
        }

        const res = await fetch("http://localhost:3000/api/wishlist/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ idLibro }),
        });

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
            timer: 1800,
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


/* ============================================================
   CARGAR SLIDERS
============================================================ */
cargarSlider("http://localhost:3000/api/products/books/novedades", "slider-novedades");
cargarSlider("http://localhost:3000/api/products/books/ofertas", "slider-ofertas");
