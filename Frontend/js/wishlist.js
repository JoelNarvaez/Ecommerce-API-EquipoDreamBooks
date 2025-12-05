document.addEventListener("DOMContentLoaded", cargarWishlist);

async function cargarWishlist() {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "login.html";

    const res = await fetch("http://localhost:3000/api/wishlist/", {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    if (!data.ok) return;

    mostrarWishlist(data.wishlist);
}

function mostrarWishlist(lista) {
    const contenedor = document.querySelector(".wishlist-items");
    const totalSpan = document.querySelector(".summary strong");

    contenedor.innerHTML = "";
    let total = 0;

    lista.forEach(item => {
        const precioNum = Number(item.precio); // ← Convertido aquí

        total += precioNum;

        contenedor.innerHTML += `
        <div class="wishlist-item" data-id="${item.ProductoId}">
            <div class="item-thumb">
                <img src="/Frontend/imagenes/libros/${item.imagen}" class="thumb-img"
                     onerror="this.src='/Frontend/imagenes/default-book.png'">
            </div>

            <div class="item-details">
                <div class="item-title">${item.nombre}</div>
                <div class="item-meta">${item.autor}</div>
                <div class="item-stock ${item.stock > 0 ? 'in-stock' : 'out-stock'}">
                    ${item.stock > 0 ? "Disponible" : "Agotado"}
                </div>
            </div>

            <div class="item-price">$${precioNum.toFixed(2)}</div>

            <div class="item-actions">
                <button class="btn btn-sm btn-primary agregar-carrito"
                    ${item.stock <= 0 ? "disabled" : ""}>
                    <i class="bi bi-cart-plus"></i> Agregar
                </button>

                <button class="remove eliminar-wishlist">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>`;
    });

    totalSpan.textContent = "$" + total.toFixed(2);

    activarEventos();
}

/* ================================
   EVENTOS: eliminar + agregar al carrito
================================ */

function activarEventos() {
    document.querySelectorAll(".eliminar-wishlist").forEach(btn => {
        btn.addEventListener("click", eliminarWishlist);
    });

    document.querySelectorAll(".agregar-carrito").forEach(btn => {
        btn.addEventListener("click", moverAlCarrito);
    });

    document.querySelector(".mover-todo")?.addEventListener("click", moverTodo);
}

/* -------- ELIMINAR -------- */
async function eliminarWishlist(e) {
    const idProducto = e.target.closest(".wishlist-item").dataset.id;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/api/wishlist/${idProducto}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    cargarWishlist();
}

/* -------- AGREGAR AL CARRITO -------- */
async function moverAlCarrito(e) {
    const item = e.target.closest(".wishlist-item");
    const idProducto = item.dataset.id;

    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/api/carts/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ productoId: idProducto, cantidad: 1 })
    });

    // también eliminar de wishlist
    await fetch(`http://localhost:3000/api/wishlist/${idProducto}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    cargarWishlist();
}

/* -------- MOVER TODO -------- */
async function moverTodo() {
    const token = localStorage.getItem("token");

    const items = document.querySelectorAll(".wishlist-item");

    for (const item of items) {
        const idProducto = item.dataset.id;

        await fetch("http://localhost:3000/api/carts/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ productoId: idProducto, cantidad: 1 })
        });

        await fetch(`http://localhost:3000/api/wishlist/${idProducto}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
    }

    cargarWishlist();
}
