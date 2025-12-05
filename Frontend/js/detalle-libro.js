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


agregarCarritoBtn = document.getElementById("agregarCarrito");
agregarCarritoBtn.addEventListener("click", () => {
    const id = Number(idActual);
  agregarAlCarrito(id);
});


// ============================
//    FUNCIONES CARRITO
// ============================

async function obtenerCarrito() {
  try {
    // 1. Verificar autenticación
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


async function agregarAlCarrito(idLibro, cantidad = 1) {
  try {
    // 1. Verificar autenticación
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
    const itemExistente = items.find((item) => item.ProductoId === idLibro);


    if (itemExistente) {
      return await actualizarItemExistente(itemExistente, cantidad, idLibro, token);
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

// ==============================
// Actualizar item existente
// ==============================
async function actualizarItemExistente(itemExistente, cantidad, idLibro, token) {
  const nuevaCantidad = itemExistente.Cantidad + cantidad;

  const updateRes = await fetch("http://localhost:3000/api/carts/actualizar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      idLibro,
      cantidad: nuevaCantidad,
    }),
  });

  const updateData = await updateRes.json();

  if (!updateRes.ok) {
    Swal.fire({
      icon: "warning",
      title: "No se pudo actualizar la cantidad del libro.",
      text: `${updateData.message || ""}`,
    });
    return;
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon: "success",
    title: "Se actualizó la cantidad del libro en el carrito a " + nuevaCantidad,
  });

  return updateData;
}



// ==============================
// Agregar nuevo item
// ==============================
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
    title: `${itemAdded.detalleProducto.nombre} Agregado`,
    text: "Libro agregado al carrito correctamente.",
  });

  return addData;
}

document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".wishlist");
    if (!btn) return;

    console.log("CLICK EN WISHLIST!!"); // <-- DEBE SALIR

    const token = localStorage.getItem("token");
    if (!token) {
        return Swal.fire("Inicia sesión", "Debes iniciar sesión para usar wishlist", "warning");
    }

    const productoId = Number(idActual);

    const res = await fetch("http://localhost:3000/api/wishlist/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ productoId })
    });

    const data = await res.json();

    if (data.ok) {
        Swal.fire("Agregado", "Libro guardado en tu lista de deseos ❤️", "success");
    } else {
        Swal.fire("Ups", data.message, "info");
    }
});
