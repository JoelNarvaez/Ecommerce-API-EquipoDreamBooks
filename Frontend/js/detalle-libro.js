console.log("detalle-libro.js cargado ✔");

let categoriaActual = null;
let idActual = null;

/* ============================
      CARGAR LIBRO
============================ */
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
        categoriaActual = libro.categoria;

        document.getElementById("img-libro").src =
            libro.imagen
                ? `http://localhost:3000/uploads/${libro.imagen}`
                : "/Frontend/assets/no-image.png";

        document.getElementById("titulo").textContent = libro.nombre;
        document.getElementById("autor").textContent = libro.autor;
        document.getElementById("editorial").textContent = libro.editorial;
        document.getElementById("descripcion").textContent = libro.descripcion;
        document.getElementById("categoria").textContent = libro.categoria;
        document.getElementById("tipo").textContent = libro.tipo_de_libro;
        document.getElementById("paginas").textContent = libro.paginas;

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

        document.getElementById("stock").innerHTML =
            libro.stock > 0
                ? `<span class="stock-disponible">Disponible (${libro.stock})</span>`
                : `<span class="stock-agotado">Agotado</span>`;

        if (categoriaActual) {
            cargarSlider(
                `http://localhost:3000/api/products/books/categoria/${categoriaActual}`,
                "slider-recomendados",
                idActual
            );
        }

    } catch (error) {
        console.error("Error cargando libro:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarLibro);


/* ============================
      SLIDERS
============================ */
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
                ? (book.oferta_tipo === "porcentaje"
                    ? precioNormal - precioNormal * (book.oferta_valor / 100)
                    : precioNormal - book.oferta_valor).toFixed(2)
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
                            onclick="event.stopPropagation(); agregarAlCarrito(${book.id})">
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

    } catch (error) {
        console.error("Error en cargarSlider:", error);
    }
}

cargarSlider("http://localhost:3000/api/products/books/novedades", "slider-novedades");
cargarSlider("http://localhost:3000/api/products/books/ofertas", "slider-ofertas");


/* ============================
      BOTÓN AGREGAR AL CARRITO
============================ */
const agregarCarritoBtn = document.getElementById("agregarCarrito");
agregarCarritoBtn.addEventListener("click", () => {
    agregarAlCarrito(Number(idActual));
});


/* ============================
      BOTÓN COMPRAR AHORA
============================ */
const btnComprarAhora = document.getElementById("btnComprarAhora");
btnComprarAhora.addEventListener("click", () => {
    comprarAhora(Number(idActual));
});


/* ============================
      OBTENER CARRITO
============================ */
async function obtenerCarrito() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const res = await fetch("http://localhost:3000/api/carts", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        return res.ok ? data : null;

    } catch (error) {
        console.error("Error obteniendo carrito:", error);
        return null;
    }
}


/* ============================
      AGREGAR / ACTUALIZAR CARRITO
============================ */
async function agregarAlCarrito(idLibro, cantidad = 1) {

    const token = localStorage.getItem("token");
    if (!token) {
        return Swal.fire("Inicia sesión", "Debes iniciar sesión para agregar libros al carrito.", "warning");
    }

    const carrito = await obtenerCarrito();

    const itemExistente = carrito?.itemsCarrito?.find(i => i.ProductoId === idLibro);

    if (itemExistente) {
        return actualizarItemExistente(itemExistente, cantidad, idLibro, token);
    }

    return agregarNuevoItem(idLibro, cantidad, token);
}


/* ============================
      ACTUALIZAR ITEM
============================ */
async function actualizarItemExistente(item, cantidad, idLibro, token) {

    const nuevaCantidad = item.Cantidad + cantidad;

    const res = await fetch("http://localhost:3000/api/carts/actualizar", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            productoId: idLibro,
            cantidad: nuevaCantidad,
        })
    });

    const data = await res.json();

    if (!res.ok) {
        return Swal.fire("Error", data.message || "Error al actualizar el carrito.", "error");
    }

    Swal.fire("Actualizado", "Cantidad actualizada correctamente", "success");
}


/* ============================
      AGREGAR NUEVO ITEM
============================ */
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


    Swal.fire("Agregado", "Libro agregado al carrito correctamente.", "success");
}


/* ============================
      WISHLIST DEL DETALLE
============================ */
document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".wishlist");
    if (!btn) return;

    const token = localStorage.getItem("token");
    if (!token) {
        return Swal.fire("Inicia sesión", "Debes iniciar sesión para usar wishlist", "warning");
    }

    const productoId = Number(idActual);

    const res = await fetch("http://localhost:3000/api/wishlist/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify({ productoId })
    });

    const data = await res.json();

    if (data.ok) {
        Swal.fire("Agregado ❤️", "Libro guardado en tu lista de deseos", "success");
    } else {
        Swal.fire("Ups", data.message, "info");
    }
});


/* ============================
      COMPRAR AHORA
============================ */
function comprarAhora(idLibro) {
    const token = localStorage.getItem("token");

    if (!token) {
        Swal.fire({
            icon: "warning",
            title: "Inicia sesión",
            text: "Debes iniciar sesión para comprar este libro.",
        });
        return;
    }

    window.location.href = `/Frontend/pages/compra.html?id=${idLibro}&cantidad=1`;
}
