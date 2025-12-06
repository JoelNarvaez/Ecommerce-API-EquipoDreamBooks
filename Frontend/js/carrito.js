// ============================
// Cargar página del carrito
// ============================
async function cargarPaginaCarrito() {
    try {
        const carritoData = await obtenerCarrito();
        inicializarCarrito(carritoData.itemsCarrito);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: "Ocurrió un error inesperado. Intenta nuevamente.",
        });
    }
}

// ============================
// Inicializar carrito
// ============================
async function inicializarCarrito(itemsCarrito = []) {
    const carritoContainer = document.getElementById("cartItems");
    carritoContainer.innerHTML = "";

    if (itemsCarrito.length === 0) {
        carritoContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
        return;
    }

    carritoContainer.innerHTML = itemsCarrito
        .map(item => {
            const imagen = item.imagen
                ? `http://localhost:3000/uploads/${item.imagen}`
                : "../assets/no-image.png";

            const precioUnitario = Number(item.precioFinal);
            const precioOriginal = Number(item.precioNormal);

            const subtotal = item.Cantidad * precioUnitario;
            const subtotalFormateado = subtotal.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN"
            });

            return `
                <div class="cart-item">
                    <div class="cart-item__thumb">
                        <img src="${imagen}"
                            alt="${item.nombre}"
                            style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                    </div>

                    <div>
                        <p class="cart-item__title">${item.nombre}</p>
                        <p class="cart-item__meta">${item.autor}</p>

                        <!-- PRECIO FORMATEADO CORRECTAMENTE -->
                        <p class="cart-item__price">
                            ${precioUnitario.toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN"
                            })}

                            ${
                                precioOriginal > precioUnitario
                                    ? `<span style="text-decoration:line-through; color:#888; font-size:12px; margin-left:5px;">
                                            ${precioOriginal.toLocaleString("es-MX", {
                                                style: "currency",
                                                currency: "MXN"
                                            })}
                                       </span>`
                                    : ""
                            }
                        </p>

                        <div class="qty">
                            <button class="qty-btn minus" data-id="${item.ProductoId}">-</button>
                            <input type="text" value="${item.Cantidad}" readonly>
                            <button class="qty-btn plus" data-id="${item.ProductoId}">+</button>
                        </div>
                    </div>

                    <div class="botones_precio">
                        <p class="cart-item__price">${subtotalFormateado}</p>
                        <button class="remove" data-id="${item.itemId}">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
            `;
        })
        .join("");

    // Totales
    const subtotal = document.getElementById("subtotal");
    const shipping = document.getElementById("shipping");
    const total = document.getElementById("total");

    const totalSubtotal = itemsCarrito.reduce(
        (acc, item) => acc + item.Cantidad * Number(item.precioFinal),
        0
    );

    const shippingCost = totalSubtotal > 0 ? 50 : 0;
    const totalAmount = totalSubtotal + shippingCost;

    subtotal.textContent = totalSubtotal.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
    shipping.textContent = shippingCost.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
    total.textContent = totalAmount.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

// =====================================
// Eventos del carrito: +, -, eliminar
// =====================================
const cont = document.getElementById("cartItems");

cont.addEventListener("click", e => {
    if (e.target.classList.contains("minus")) {
        const id = Number(e.target.dataset.id);
        agregarAlCarrito(id, 1, false);
    }

    if (e.target.classList.contains("plus")) {
        const id = Number(e.target.dataset.id);
        agregarAlCarrito(id, 1, true);
    }

    const btnRemove = e.target.closest(".remove");
    if (btnRemove) {
        const id = Number(btnRemove.dataset.id);
        EliminarItemCarrito(id);
        return;
    }
});

// ============================
// Obtener carrito desde backend
// ============================
async function obtenerCarrito() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Inicia sesión",
                text: "Debes iniciar sesión para manejar tu carrito.",
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
// Agregar al carrito
// ============================
async function agregarAlCarrito(idLibro, cantidad = 1, increment = true) {
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
        const itemExistente = items.find(item => item.ProductoId === idLibro);

        if (itemExistente) {
            await actualizarItemExistente(itemExistente, cantidad, idLibro, token, increment);
        } else {
            await agregarNuevoItem(idLibro, cantidad, token);
        }

        await cargarPaginaCarrito();
    } catch (error) {
        console.error("Error inesperado:", error);
        Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: error.message || "Ocurrió un error inesperado.",
        });
    }
}

// ============================
// Actualizar item existente
// ============================
async function actualizarItemExistente(itemExistente, cantidad, idLibro, token, increment = true) {
    const nuevaCantidad = increment
        ? itemExistente.Cantidad + cantidad
        : itemExistente.Cantidad - cantidad;

    const updateRes = await fetch("http://localhost:3000/api/carts/actualizar", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            productoId: idLibro,
            cantidad: nuevaCantidad,
        }),
    });

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
        Swal.fire({
            icon: "warning",
            title: "No se pudo actualizar la cantidad.",
            text: updateData.message || "",
        });
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Cantidad actualizada a " + nuevaCantidad,
    });

    return updateData;
}

// ============================
// Agregar nuevo item
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
            title: "No se pudo agregar el libro.",
            text: addData.message || "",
        });
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Libro agregado al carrito",
    });

    return addData;
}

// ============================
// Eliminar item del carrito
// ============================
async function EliminarItemCarrito(idItem) {
    const token = localStorage.getItem("token");

    if (!token) {
        Swal.fire({
            icon: "warning",
            title: "Inicia sesión",
            text: "Debes iniciar sesión para eliminar libros del carrito.",
        });
        return;
    }

    const addRes = await fetch(`http://localhost:3000/api/carts/eliminar/${idItem}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    const addData = await addRes.json();

    if (!addRes.ok) {
        Swal.fire({
            icon: "error",
            title: "No se pudo eliminar el libro.",
            text: addData.message || "",
        });
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Libro eliminado correctamente",
    });

    await cargarPaginaCarrito();
}

// Cargar carrito al iniciar
cargarPaginaCarrito();


// ============================
// Ir a la página de compra
// ============================
document.getElementById("checkoutBtn").addEventListener("click", () => {
    window.location.href = "../pages/compra.html";
});

async function cargarPaginaCarrito() {
    try {
        const carritoData = await obtenerCarrito();

        // Guardar carrito para la página de compra
        localStorage.setItem("carritoDreamBooks", JSON.stringify(carritoData.itemsCarrito));

        inicializarCarrito(carritoData.itemsCarrito);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: "Ocurrió un error inesperado. Intenta nuevamente.",
        });
    }
}
