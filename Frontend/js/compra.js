/* ========================================================
   VALIDAR FORMULARIO COMPLETO
======================================================== */
function validarFormulario() {
    const errores = [];

    // DATOS PERSONALES
    const nombre = document.getElementById("nombrePersona").value.trim();
    const apellido = document.getElementById("apellidoPersona").value.trim();
    const email = document.getElementById("emailPersona").value.trim();
    const telefono = document.getElementById("telefonoPersona").value.trim();

    if (nombre.length < 2) errores.push("El nombre es obligatorio.");
    if (apellido.length < 2) errores.push("El apellido es obligatorio.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errores.push("Debe ingresar un email válido.");

    if (telefono.length < 10) errores.push("El teléfono debe tener al menos 10 dígitos.");

    // MÉTODO DE PAGO
    const titular = document.getElementById("nombreTitular").value.trim();
    const cardNum = document.getElementById("cardNumber").value.trim();
    const cvv = document.getElementById("cvv").value.trim();
    const expMonth = document.getElementById("expMonth").value;
    const expYear = document.getElementById("expYear").value;

    if (titular.length < 2) errores.push("El nombre del titular es obligatorio.");
    if (cardNum.length !== 16) errores.push("La tarjeta debe tener 16 dígitos.");
    if (cvv.length !== 3) errores.push("El CVV debe tener 3 dígitos.");
    if (expMonth === "" || expYear === "") errores.push("Seleccione una fecha de expiración válida.");

    // DIRECCIÓN DE ENVÍO
    const direccion = document.getElementById("direccionEnvio").value.trim();
    const ciudad = document.getElementById("ciudadEnvio").value.trim();
    const estado = document.getElementById("estadoEnvio").value.trim();
    const referencia = document.getElementById("refEnvio").value.trim();
    const postal = document.getElementById("postalCodeEnvio").value.trim();

    if (direccion.length < 5) errores.push("Dirección inválida.");
    if (ciudad.length < 2) errores.push("Ciudad inválida.");
    if (estado.length < 2) errores.push("Estado inválido.");
    if (referencia.length < 3) errores.push("Referencia inválida.");
    if (postal.length !== 5) errores.push("El código postal debe tener 5 dígitos.");

    return errores;
}

/* ========================================================
   SOLO PERMITIR NÚMEROS
======================================================== */
function soloNumeros(input) {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
    });
}

soloNumeros(document.getElementById("telefonoPersona"));
soloNumeros(document.getElementById("cardNumber"));
soloNumeros(document.getElementById("cvv"));
soloNumeros(document.getElementById("postalCodeEnvio"));

/* ========================================================
   GENERAR AÑOS AUTOMÁTICAMENTE
======================================================== */
const yearSelect = document.getElementById("expYear");
const currentYear = new Date().getFullYear();
for (let i = 0; i < 15; i++) {
    const year = currentYear + i;
    const option = document.createElement("option");
    option.value = year.toString().slice(2);
    option.textContent = year;
    yearSelect.appendChild(option);
}

/* ========================================================
   EXTRAER usuario_id DEL TOKEN
======================================================== */
function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
}

/* ========================================================
   DETECTAR COMPRA DIRECTA
======================================================== */
const urlParams = new URLSearchParams(window.location.search);
const libroDirectoId = urlParams.get("id");
const libroDirectoCantidad = Number(urlParams.get("cantidad")) || 1;

/* ========================================================
   OBTENER UN LIBRO INDIVIDUAL PARA COMPRA DIRECTA
======================================================== */
async function cargarCompraDirecta() {
    if (!libroDirectoId) return null;

    const res = await fetch(`http://localhost:3000/api/products/book/${libroDirectoId}`);
    const data = await res.json();

    if (!data.ok) return null;

    const libro = data.libro;
    const precioNormal = Number(libro.precio);
    const precioFinal = precioNormal; // sin ofertas aquí, si tienes ofertas las agregamos

    const item = {
        ProductoId: libroDirectoId,
        Cantidad: libroDirectoCantidad,
        nombre: libro.nombre,
        autor: libro.autor,
        imagen: libro.imagen,
        precioNormal,
        precioFinal
    };

    return [item];
}

/* ========================================================
   OBTENER CARRITO NORMAL
======================================================== */
async function obtenerCarrito() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const res = await fetch("http://localhost:3000/api/carts", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) return null;

        return await res.json();
    } catch (error) {
        console.error("Error obteniendo carrito:", error);
        return null;
    }
}

/* ========================================================
   GENERAR HTML DE PRODUCTO
======================================================== */
function generarProductoHTML(item) {
    const precioNormal = Number(item.precioNormal);
    const precioFinal = Number(item.precioFinal);
    const tieneOferta = precioFinal < precioNormal;

    return `
        <div class="productoResumen">
            <div class="imgBox">
                <img src="${item.imagen ? `http://localhost:3000/uploads/${item.imagen}` : "/Frontend/assets/no-image.png"}" />
            </div>

            <div class="infoBox">
                <h3>${item.nombre}</h3>
                <p class="autor">${item.autor}</p>

                <div class="preciosProductos">
                    <span class="precioFinal">
                        ${precioFinal.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                    </span>

                    ${tieneOferta ? `<span class="precioNormal">
                        ${precioNormal.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                    </span>` : ""}
                </div>

                <p class="cantidad">Cantidad: <strong>${item.Cantidad}</strong></p>
            </div>
        </div>
    `;
}

/* ========================================================
   CARGAR RESUMEN (CARRITO O COMPRA DIRECTA)
======================================================== */
async function cargarResumenCompra() {
    const contenedor = document.querySelector(".resumenOrden");

    const subtotalHTML = document.getElementById("subtotal");
    const ivaHTML = document.getElementById("iva");
    const descuentoHTML = document.getElementById("descuento");
    const totalHTML = document.getElementById("totalFinal");

    let items = [];

    /* 🔥 COMPRA DIRECTA (cuando viene ?compra=ID en la URL) */
    if (libroDirectoId) {
        items = await cargarCompraDirecta();
    } 
    
    /* 🛒 Si NO es compra directa → cargar carrito */
    else {
        const carritoData = await obtenerCarrito();

        if (!carritoData || carritoData.itemsCarrito.length === 0) {
            contenedor.innerHTML = "<p>No hay productos en tu carrito.</p>";
            return;
        }

        items = carritoData.itemsCarrito;
    }

    /* Renderizar los productos */
    contenedor.innerHTML = items.map(item => generarProductoHTML(item)).join("");

    /* ============================================
       CALCULAR SUBTOTAL, IVA Y TOTAL SIN DESCUENTO
    ============================================ */
    const subtotal = items.reduce(
        (acc, item) => acc + item.Cantidad * Number(item.precioFinal),
        0
    );

    const iva = subtotal * 0.16;
    const descuento = 0;
    const total = subtotal + iva - descuento;

    /* Mostrar valores iniciales */
    subtotalHTML.textContent = subtotal.toFixed(2);
    ivaHTML.textContent = iva.toFixed(2);
    descuentoHTML.textContent = descuento.toFixed(2);
    totalHTML.textContent = total.toFixed(2);

    /* Guardar información global */
    window.dataCompra = {
        subtotal,
        iva,
        descuento,
        total,
        items
    };
}

/* ========================================================
   ACTUALIZAR LOS TOTALES EN PANTALLA
======================================================== */
function actualizarResumenFinal() {
    const subtotalHTML = document.getElementById("subtotal");
    const ivaHTML = document.getElementById("iva");
    const descuentoHTML = document.getElementById("descuento");
    const totalHTML = document.getElementById("totalFinal");

    const { subtotal, iva, descuento, total } = window.dataCompra;

    subtotalHTML.textContent = subtotal.toFixed(2);
    ivaHTML.textContent = iva.toFixed(2);
    descuentoHTML.textContent = descuento.toFixed(2);
    totalHTML.textContent = total.toFixed(2);
}


/* ========================================================
   APLICAR CUPÓN
======================================================== */
document.getElementById("aplicarCupon").addEventListener("click", async () => {
    const codigo = document.getElementById("cuponInput").value.trim();
    const mensaje = document.getElementById("cuponMensaje");

    // SI SE BORRA EL CUPÓN
    if (codigo === "") {
        mensaje.innerText = "";
        window.dataCompra.descuento = 0;
        window.dataCompra.total = window.dataCompra.subtotal + window.dataCompra.iva;

        actualizarResumenFinal();
        return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/carts/aplicar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ codigo })
    });

    const data = await res.json();

    if (!data.ok) {
        mensaje.style.color = "red";
        mensaje.innerText = data.message;

        window.dataCompra.descuento = 0;
        window.dataCompra.total = window.dataCompra.subtotal + window.dataCompra.iva;

        actualizarResumenFinal();
        return;
    }

    // CUPÓN VÁLIDO
    const cupon = Number(data.cupon.MontoDescuento);

    mensaje.style.color = "green";
    mensaje.innerText = `Cupón aplicado: -$${cupon}`;

    // ACTUALIZAR VARIABLES GLOBALES
    window.dataCompra.descuento = cupon;
    window.dataCompra.total =
        window.dataCompra.subtotal + window.dataCompra.iva - cupon;

    // REFRESCAR TOTALES EN PANTALLA
    actualizarResumenFinal();
});


/* ========================================================
   CONFIRMAR COMPRA
======================================================== */
document.getElementById("confirmarOrdenBtn").addEventListener("click", async () => {
    const errores = validarFormulario();
    if (errores.length > 0) {
        alert("⚠️ Corrige los siguientes errores:\n\n" + errores.join("\n"));
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión.");
        return;
    }

    const usuario_id = getUserIdFromToken();

    const { subtotal, iva, descuento, total, items } = window.dataCompra;
    const cupon = document.getElementById("cuponInput").value.trim() || null;

    const res = await fetch("http://localhost:3000/api/carts/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            usuario_id,
            subtotal,
            iva,
            descuento,
            totalFinal: total,
            cupon,
            items
        })
    });

    const data = await res.json();

    if (!data.ok) {
        alert("❌ Error al procesar la orden: " + data.message);
        return;
    }

    alert("✔ ¡Pedido creado exitosamente!");
    window.location.href = "/Frontend/pedido_exitoso.html";
});

/* ========================================================
   INICIO
======================================================== */
cargarResumenCompra();
