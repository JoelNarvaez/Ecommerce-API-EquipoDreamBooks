document.addEventListener("DOMContentLoaded", cargarWishlist);

async function cargarWishlist() {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "login.html";

    /*const res = await fetch("http://localhost:3000/api/wishlist/", {*/
    const res = await fetch("https://ecommerce-api-equipodreambooks-production.up.railway.app/api/wishlist/", {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    if (!data.ok) return;

    mostrarWishlist(data.wishlist);
}

function mostrarWishlist(lista) {
    const contenedor = document.querySelector(".wishlist-items");
    const totalSpan = document.querySelector(".total strong");

    contenedor.innerHTML = "";
    let total = 0;

    lista.forEach(item => {
        const precioNum = Number(item.precio ?? 0);
        total += precioNum;

        contenedor.innerHTML += `
        <div class="wishlist-item" data-id="${item.ProductoId}">
            <div class="item-thumb">
                <img src="https://ecommerce-api-equipodreambooks-production.up.railway.app/uploads/${item.imagen}"
                     class="thumb-img"
                     onerror="this.src='../assets/no-image.png'">
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

    // 🔥 ACTUALIZAR TOTAL
    totalSpan.textContent = "$" + total.toFixed(2);

    // 🔥 ACTUALIZAR CONTADOR
    const countSpan = document.getElementById("wishlist-count");
    const cantidadLibros = lista.length;
    countSpan.innerHTML = `Tienes <strong>${cantidadLibros} libro${cantidadLibros === 1 ? "" : "s"}</strong> en tu lista de deseos.`;

    activarEventos();
}


/* ================================
   EVENTOS
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
/* -------- ELIMINAR -------- */
async function eliminarWishlist(e) {
    const idProducto = e.target.closest(".wishlist-item").dataset.id;
    const token = localStorage.getItem("token");

    const confirm = await Swal.fire({
        title: "¿Eliminar de tu lista?",
        text: "Este libro se eliminará de tu lista de deseos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    /*await fetch(`http://localhost:3000/api/wishlist/${idProducto}`, {*/
    await fetch(`https://ecommerce-api-equipodreambooks-production.up.railway.app/api/wishlist/${idProducto}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El libro fue eliminado de tu lista.",
        timer: 1500,
        showConfirmButton: false
    });

    cargarWishlist();
}

/* -------- AGREGAR AL CARRITO -------- */
async function moverAlCarrito(e) {
    const idProducto = e.target.closest(".wishlist-item").dataset.id;
    const token = localStorage.getItem("token");

    /*await fetch("http://localhost:3000/api/carts/agregar", {*/
    await fetch("https://ecommerce-api-equipodreambooks-production.up.railway.app/api/carts/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ productoId: idProducto, cantidad: 1 })
    });

    /*await fetch(`http://localhost:3000/api/wishlist/${idProducto}`, {*/
    await fetch(`http://ecommerce-api-equipodreambooks-production.up.railway.app/api/wishlist/${idProducto}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    Swal.fire({
        icon: "success",
        title: "Agregado al carrito",
        text: "Este libro ahora está en tu carrito.",
        timer: 1500,
        showConfirmButton: false
    });

    cargarWishlist();
}


/* -------- MOVER TODO -------- */
/* -------- MOVER TODO -------- */
async function moverTodo() {
    const token = localStorage.getItem("token");
    const items = document.querySelectorAll(".wishlist-item");

    if (items.length === 0) {
        return Swal.fire({
            icon: "info",
            title: "Lista vacía",
            text: "No hay libros para mover al carrito."
        });
    }

    const confirm = await Swal.fire({
        title: "Mover todos al carrito",
        text: "Todos los libros pasarán al carrito.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Mover",
        cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    for (const item of items) {
        const idProducto = item.dataset.id;

        /*await fetch("http://localhost:3000/api/carts/agregar", {*/
        await fetch("https://ecommerce-api-equipodreambooks-production.up.railway.app/api/carts/agregar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ productoId: idProducto, cantidad: 1 })
        });

        /*await fetch(`http://localhost:3000/api/wishlist/${idProducto}`, {*/
        await fetch(`https://ecommerce-api-equipodreambooks-production.up.railway.app/api/wishlist/${idProducto}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
    }

    Swal.fire({
        icon: "success",
        title: "Completado",
        text: "Todos los libros fueron movidos al carrito.",
        timer: 1500,
        showConfirmButton: false
    });

    cargarWishlist();
}

