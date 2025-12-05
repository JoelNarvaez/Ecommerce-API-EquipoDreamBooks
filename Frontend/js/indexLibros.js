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

      // SOLO la parte clickeable del detalle va dentro del <a>
      cont.innerHTML += `
                <div class="product-card card-slider">

                    <a href="/Frontend/pages/detalle-libro.html?id=${book.id
        }" class="link-card">
                        ${tieneOferta
          ? `<span class="badge-oferta">Oferta</span>`
          : ""
        }
                        ${book.stock === 0
          ? `<span class="badge-agotado">Agotado</span>`
          : ""
        }

                        <div class="product-image">
                            <img src="${urlImagen}" alt="${book.nombre}">
                        </div>

                        <div class="product-info">
                            <h3>${book.nombre}</h3>
                            <p class="autor">${book.autor}</p>
                            <p class="editorial">${book.editorial}</p>

                            <div class="precio">
                                ${tieneOferta
          ? `
                                        <span class="precio-original">$${precioNormal}</span>
                                        <span class="precio-oferta">$${precioOferta}</span>
                                      `
          : `<span class="precio-normal">$${precioNormal}</span>`
        }
                            </div>

                            <p class="${book.stock > 0
          ? "stock-disponible"
          : "stock-agotado"
        }">
                                ${book.stock > 0
          ? `Disponible (${book.stock})`
          : "Agotado"
        }
                            </p>
                        </div>
                    </a>

                    <!-- ICONOS -->
                    <div class="card-actions">
                        <button class="btn-card wishlist-btn" data-id="${book.id
        }">
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

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".slider-btn");

  buttons.forEach((btn) => {
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
cargarSlider(
  "http://localhost:3000/api/products/books/novedades",
  "slider-novedades"
);
cargarSlider(
  "http://localhost:3000/api/products/books/ofertas",
  "slider-ofertas"
);
//cargarSlider("http://localhost:3000/api/books/mas-vendidos", "slider-mas-vendidos");

const cont = document.getElementById("slider-novedades");
cont.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");

  if (!btn) return;

  if (btn.classList.contains("cart-btn")) {
    const id = Number(btn.dataset.id);
    await agregarAlCarrito(id);
    return;
  }

  if (btn.classList.contains("wishlist-btn")) {
    const id = Number(btn.dataset.id);
    console.log("Agregar a wishlist:", id);
    return;
  }

  if (btn.classList.contains("buy-btn")) {
    const id = Number(btn.dataset.id);
    console.log("Compra rápida:", id);
    return;
  }
});

const SliderOfertas = document.getElementById("slider-ofertas");
SliderOfertas.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");

  if (!btn) return;

  if (btn.classList.contains("cart-btn")) {
    const id = Number(btn.dataset.id);
    await agregarAlCarrito(id);
    return;
  }

  if (btn.classList.contains("wishlist-btn")) {
    const id = Number(btn.dataset.id);
    console.log("Agregar a wishlist:", id);
    return;
  }

  if (btn.classList.contains("buy-btn")) {
    const id = Number(btn.dataset.id);
    console.log("Compra rápida:", id);
    return;
  }
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

