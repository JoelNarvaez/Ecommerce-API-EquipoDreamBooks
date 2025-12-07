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

    // =====================================================
    // MÉTODO DE PAGO (AGREGADO)
    // =====================================================
    const metodo = document.querySelector("input[name='metodoPago']:checked")?.value;
    window.dataCompra.metodoPago = metodo;

    if (metodo === "tarjeta") {
        const titular = document.getElementById("nombreTitular").value.trim();
        const cardNum = document.getElementById("cardNumber").value.trim();
        const cvv = document.getElementById("cvv").value.trim();
        const expMonth = document.getElementById("expMonth").value;
        const expYear = document.getElementById("expYear").value;

        if (titular.length < 2) errores.push("El nombre del titular es obligatorio.");
        if (cardNum.length !== 16) errores.push("La tarjeta debe tener 16 dígitos.");
        if (cvv.length !== 3) errores.push("El CVV debe tener 3 dígitos.");
        if (expMonth === "" || expYear === "") errores.push("Seleccione una fecha de expiración válida.");
    }

    // OXXO y Transferencia NO requieren validación extra

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
   COSTOS DE ENVÍO POR PAÍS (AGREGADO)
======================================================== */
const costosEnvio = {
    mexico: 99,
    usa: 250,
    canada: 280,
    españa: 350,
    latam: 200
};

const envioP = document.createElement("p");
envioP.innerHTML = `Envío: $<span id="envio">0</span>`;
document.querySelector(".contenedorTotal").insertBefore(envioP, document.querySelector(".total"));

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
/* ========================================================
   OBTENER UN LIBRO INDIVIDUAL PARA COMPRA DIRECTA
======================================================== */
async function cargarCompraDirecta() {
    if (!libroDirectoId) return null;

    const res = await fetch(`https://ecommerce-api-equipodreambooks-production.up.railway.app/api/products/book/${libroDirectoId}`);
    const data = await res.json();

    if (!data.ok) return null;

    const libro = data.libro;

    if (libro.stock <= 0) {
        Swal.fire({
            icon: "error",
            title: "Producto sin stock",
            text: "Este producto actualmente no está disponible.",
            confirmButtonText: "Volver",
        }).then(() => {
            window.location.href = "../index.html";  // o productos.html si prefieres
        });

        return null;
    }

    if (libro.stock < libroDirectoCantidad) {
        Swal.fire({
            icon: "warning",
            title: "Stock insuficiente",
            text: `Solo hay ${libro.stock} unidades disponibles.`,
            confirmButtonText: "Entendido",
        });

        return null;
    }

    return [{
        ProductoId: libroDirectoId,
        Cantidad: libroDirectoCantidad,
        nombre: libro.nombre,
        autor: libro.autor,
        imagen: libro.imagen,
        precioNormal: Number(libro.precio),
        precioFinal: Number(libro.precio)
    }];
}

/* ========================================================
   OBTENER CARRITO NORMAL
======================================================== */
async function obtenerCarrito() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        /*const res = await fetch("http://localhost:3000/api/carts", {*/
        const res = await fetch("https://ecommerce-api-equipodreambooks-production.up.railway.app/api/carts", {
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
                <img src="${item.imagen ? `https://ecommerce-api-equipodreambooks-production.up.railway.app/uploads/${item.imagen}` : "../assets/no-image.png"}" />
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

    if (libroDirectoId) {
        items = await cargarCompraDirecta();

        // Si regresar null → detener todo
        if (!items) {
            contenedor.innerHTML = "<p>No se puede procesar la compra.</p>";
            return; 
        }
    } 
    else {
        const carritoData = await obtenerCarrito();

        if (!carritoData || carritoData.itemsCarrito.length === 0) {
            contenedor.innerHTML = "<p>No hay productos en tu carrito.</p>";
            return;
        }

        items = carritoData.itemsCarrito;
    }

    // =====================================================
    // GENERAR HTML
    // =====================================================
    contenedor.innerHTML = items.map(item => generarProductoHTML(item)).join("");

    const subtotal = items.reduce(
        (acc, item) => acc + item.Cantidad * Number(item.precioFinal),
        0
    );

    const iva = subtotal * 0.16;

    window.dataCompra = {
        subtotal,
        iva,
        descuento: 0,
        envio: 0,
        total: subtotal + iva,
        items
    };

    subtotalHTML.textContent = subtotal.toFixed(2);
    ivaHTML.textContent = iva.toFixed(2);
    descuentoHTML.textContent = "0";
    totalHTML.textContent = window.dataCompra.total.toFixed(2);

    recalcularEnvioYTotales();
}


/* ========================================================
   ACTUALIZAR LOS TOTALES EN PANTALLA
======================================================== */
function actualizarResumenFinal() {
    document.getElementById("subtotal").textContent = window.dataCompra.subtotal.toFixed(2);
    document.getElementById("iva").textContent = window.dataCompra.iva.toFixed(2);
    document.getElementById("descuento").textContent = window.dataCompra.descuento.toFixed(2);
    document.getElementById("envio").textContent = window.dataCompra.envio.toFixed(2);
    document.getElementById("totalFinal").textContent = window.dataCompra.total.toFixed(2);
}

/* ========================================================
   CALCULAR ENVÍO (AGREGADO)
======================================================== */
function recalcularEnvioYTotales() {
    const pais = document.getElementById("paisEnvio").value;
    const envio = pais ? costosEnvio[pais] : 0;

    window.dataCompra.envio = envio;

    const { subtotal, iva, descuento } = window.dataCompra;

    window.dataCompra.total = subtotal + iva - descuento + envio;

    actualizarResumenFinal();
}

/* ========================================================
   APLICAR CUPÓN
======================================================== */
document.getElementById("aplicarCupon").addEventListener("click", async () => {
    const codigo = document.getElementById("cuponInput").value.trim();
    const mensaje = document.getElementById("cuponMensaje");

    if (codigo === "") {
        mensaje.innerText = "";
        window.dataCompra.descuento = 0;
        window.dataCompra.total = window.dataCompra.subtotal + window.dataCompra.iva + window.dataCompra.envio;
        actualizarResumenFinal();
        return;
    }

    const token = localStorage.getItem("token");

    /*const res = await fetch("http://localhost:3000/api/carts/aplicar", {*/
    const res = await fetch("https://ecommerce-api-equipodreambooks-production.up.railway.app/api/carts/aplicar", {
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
        window.dataCompra.total = window.dataCompra.subtotal + window.dataCompra.iva + window.dataCompra.envio;
        actualizarResumenFinal();
        return;
    }

    const cupon = Number(data.cupon.MontoDescuento);

    mensaje.style.color = "green";
    mensaje.innerText = `Cupón aplicado: -$${cupon}`;

    window.dataCompra.descuento = cupon;

    window.dataCompra.total =
        window.dataCompra.subtotal + window.dataCompra.iva - cupon + window.dataCompra.envio;

    actualizarResumenFinal();
});

/* ========================================================
   CONFIRMAR COMPRA
======================================================== */
document.getElementById("confirmarOrdenBtn").addEventListener("click", async () => {
    const errores = validarFormulario();

    if (errores.length > 0) {
        Swal.fire({
            icon: "warning",
            title: "Corrige los siguientes errores",
            html: errores.map(e => `• ${e}`).join("<br>"),
            confirmButtonText: "Entendido",
        });
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        Swal.fire({
            icon: "error",
            title: "Debes iniciar sesión",
            text: "Inicia sesión para continuar.",
            confirmButtonText: "Ok"
        });
        return;
    }

    const usuario_id = getUserIdFromToken();
    const { subtotal, iva, descuento, total, envio, items, metodoPago } = window.dataCompra;
    const cupon = document.getElementById("cuponInput").value.trim() || null;
    const esCompraDirecta = !!libroDirectoId;

    /*const res = await fetch("http://localhost:3000/api/carts/checkout", {*/
    const res = await fetch("https://ecommerce-api-equipodreambooks-production.up.railway.app/api/carts/checkout", {
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
            envio,
            totalFinal: total,
            cupon,
            items,
            metodoPago,
            compraDirecta: esCompraDirecta
        })
    });

    const data = await res.json();

    if (!data.ok) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al procesar la orden: ' + data.message,
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: '¡Pedido creado exitosamente!',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        window.location.href = "../index.html";
    });
});

/* ========================================================
   MOSTRAR/OCULTAR MÉTODOS DE PAGO (AGREGADO)
======================================================== */
document.querySelectorAll("input[name='metodoPago']").forEach(radio => {
    radio.addEventListener("change", () => {
        const metodo = radio.value;
        window.dataCompra.metodoPago = metodo;

        document.querySelector(".metodo-tarjeta").style.display =
            metodo === "tarjeta" ? "grid" : "none";

        document.querySelector(".metodo-oxxo").style.display =
            metodo === "oxxo" ? "block" : "none";

        document.querySelector(".metodo-transferencia").style.display =
            metodo === "transferencia" ? "block" : "none";
    });
});

/* ========================================================
   INICIO
======================================================== */
cargarResumenCompra();

document.getElementById("paisEnvio").addEventListener("change", recalcularEnvioYTotales);
