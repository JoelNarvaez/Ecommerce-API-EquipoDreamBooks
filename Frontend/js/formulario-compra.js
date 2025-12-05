// ======================================
//   GENERAR AÑOS EN SELECT
// ======================================
const yearSelect = document.getElementById("expYear");
const currentYear = new Date().getFullYear();

for (let i = 0; i < 15; i++) {
    const year = currentYear + i;
    const option = document.createElement("option");
    option.value = year.toString().slice(2);
    option.textContent = year;
    yearSelect.appendChild(option);
}

// ======================================
//   SOLO NÚMEROS EN INPUTS
// ======================================
function soloNumeros(input) {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
    });
}

soloNumeros(document.getElementById("telefonoPersona"));
soloNumeros(document.getElementById("cardNumber"));
soloNumeros(document.getElementById("cvv"));
soloNumeros(document.getElementById("postalCodeEnvio"));

// ======================================
//   CALCULAR SUBTOTAL, IVA Y TOTAL
// ======================================
const precio = 199;
const cantidad = 2;
const subtotal = precio * cantidad;
const iva = subtotal * 0.16;

let descuento = 0;

document.getElementById("subtotal").innerText = subtotal.toFixed(2);
document.getElementById("iva").innerText = iva.toFixed(2);
document.getElementById("totalFinal").innerText = (subtotal + iva).toFixed(2);

// ======================================
//   CUPONES DISPONIBLES
// ======================================
const cupones = {
    "DREAM10": 10,
    "LIBROS20": 20,
    "DESCUENTO50": 50
};

document.getElementById("aplicarCupon").addEventListener("click", () => {
    const codigo = document.getElementById("cuponInput").value.trim().toUpperCase();
    const mensaje = document.getElementById("cuponMensaje");

    if (cupones[codigo]) {
        descuento = cupones[codigo];
        mensaje.innerText = `Cupón aplicado: -$${descuento}`;
        document.getElementById("descuento").innerText = descuento.toFixed(2);
    } else {
        mensaje.innerText = "Cupón inválido";
        descuento = 0;
        document.getElementById("descuento").innerText = "0";
    }

    const total = subtotal + iva - descuento;
    document.getElementById("totalFinal").innerText = total.toFixed(2);
});

// ======================================
//   VALIDAR CAMPO Y GENERAR ORDEN
// ======================================
document.getElementById("confirmarOrdenBtn").addEventListener("click", () => {

    // Validaciones generales…

    const orden = {
        producto: {
            nombre: "El Principito",
            cantidad,
            precioUnitario: precio
        },
        costo: {
            subtotal,
            iva,
            descuento,
            total: subtotal + iva - descuento
        }
    };

    console.log("ORDEN FINAL:", orden);
    alert("✔ Orden generada correctamente.");
});
