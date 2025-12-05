

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

async function inicializarCarrito(itemsCarrito = []) {
    const carritoContainer = document.getElementById("cartItems");
    carritoContainer.innerHTML = "";

    

    if (itemsCarrito.length === 0) {
        carritoContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
        return;
    }
    carritoContainer.innerHTML = itemsCarrito.map(item => {

        item.detalleProducto.imagen = item.detalleProducto.imagen ? `http://localhost:3000/uploads/${item.detalleProducto.imagen}` : "/Frontend/assets/no-image.png";

        const subtotal = item.Cantidad * item.detalleProducto.precio;

        const subtotalFormateado = subtotal.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        });


        return `<div class="cart-item">
                    <div class="cart-item__thumb">
                        <img src="${item.detalleProducto.imagen}"
                            alt="${item.detalleProducto.nombre}"
                            style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                    </div>

                    <div>
                        <p class="cart-item__title">${item.detalleProducto.nombre}</p>
                        <p class="cart-item__meta">${item.detalleProducto.autor}</p>
                        <p class="cart-item__price">${item.detalleProducto.precio} MXN</p>

                        <div class="qty">
                            <button class="qty-btn minus" data-id="${item.ProductoId}">-</button>
                            <input type="text" value="${item.Cantidad}" readonly>
                            <button class="qty-btn plus" data-id="${item.ProductoId}">+</button>
                        </div>
                    </div>

                    <div class="botones_precio">
                        <p class="cart-item__price">${subtotalFormateado}</p>
                        <button class="remove" data-id="${item.Id}">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>`

    });


    const subtotal = document.getElementById("subtotal");
    const shipping = document.getElementById("shipping");
    const total = document.getElementById("total");

    const totalSubtotal = itemsCarrito.reduce((acc, item) => acc + (item.Cantidad * item.detalleProducto.precio), 0);
    const shippingCost = totalSubtotal > 0 ? 50 : 0;
    const totalAmount = totalSubtotal + shippingCost;

    subtotal.innerHTML = totalSubtotal.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    shipping.textContent = shippingCost.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    total.textContent = totalAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

}

const cont = document.getElementById("cartItems");
cont.addEventListener("click", (e) => {
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
        EliminarItemCarrito(id)
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


async function agregarAlCarrito(idLibro, cantidad = 1, increment = true) {
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
            text: `${error.message || "Ocurrió un error inesperado. Intenta nuevamente."}`,
        });
    }
}

// ==============================
// Actualizar item existente
// ==============================
async function actualizarItemExistente(itemExistente, cantidad, idLibro, token, increment = true) {
    const nuevaCantidad = increment ? itemExistente.Cantidad + cantidad : itemExistente.Cantidad - cantidad;

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
            idLibro,
            cantidad,
        }),
    });

    const addData = await addRes.json();

    const items = addData.carrito;

    const itemAdded = items.find((item) => item.detalleProducto.id === idLibro);

    if (!addRes.ok) {
        Swal.fire({
            icon: "error",
            title: "No se pudo agregar el libro al carrito.",
            text: addData.message || "",
        });
        return;
    }

    Swal.fire({
        icon: "success",
        title: `${itemAdded.detalleProducto.nombre} Agregado`,
        text: "Libro agregado al carrito correctamente.",
    });

    return addData;
}

// =============================
// eliminar item
// =============================
async function EliminarItemCarrito(idItem) {

    const token = localStorage.getItem("token");

    if (!token) {
        Swal.fire({
            icon: "warning",
            title: "Inicia sesión",
            text: "Debes iniciar sesión para agregar libros al carrito.",
        });
        return;
    }

    const addRes = await fetch(`http://localhost:3000/api/carts/eliminar/${idItem}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            idItem
        }),
    });

    const addData = await addRes.json();

    if (!addRes.ok) {
        Swal.fire({
            icon: "error",
            title: "No se eliminar el libro del carrito.",
            text: addData.message || "",
        });
        return;
    }

    Swal.fire({
        icon: "success",
        title: `libro eliminado del carrito`,
        text: "Libro eliminado del carrito correctamente.",
    });

    await cargarPaginaCarrito();
}

cargarPaginaCarrito();