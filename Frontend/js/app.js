// ELEMENTOS
const btnPanel = document.getElementById("btnAccesibilidad");
const panel = document.getElementById("panelAccesibilidad");
const btnTema = document.getElementById("btnTema");
const iconTema = document.getElementById("iconTema");

const btnTextoMas = document.getElementById("textoMas");
const btnTextoMenos = document.getElementById("textoMenos");

// ------------------------------
//  ABRIR / CERRAR PANEL
// ------------------------------
btnPanel.addEventListener("click", () => {
    panel.classList.toggle("activo");
});

// ------------------------------
//  MODO CLARO / OSCURO
// ------------------------------
function aplicarTema(tema) {
    if (tema === "oscuro") {
        document.body.classList.add("modo-oscuro");
        iconTema.classList.replace("fa-moon", "fa-sun");
    } else {
        document.body.classList.remove("modo-oscuro");
        iconTema.classList.replace("fa-sun", "fa-moon");
    }
}

btnTema.addEventListener("click", () => {
    const temaActual = localStorage.getItem("tema") || "claro";
    const nuevoTema = temaActual === "claro" ? "oscuro" : "claro";

    localStorage.setItem("tema", nuevoTema);
    aplicarTema(nuevoTema);
});

// ------------------------------
//  CONTROL DE TEXTO
// ------------------------------
let tamaño = parseInt(localStorage.getItem("textoTamano")) || 16;

function aplicarTamaño() {
    document.documentElement.style.fontSize = tamaño + "px";
    localStorage.setItem("textoTamano", tamaño);
}

btnTextoMas.addEventListener("click", () => {
    if (tamaño < 22) tamaño += 2;
    aplicarTamaño();
});

btnTextoMenos.addEventListener("click", () => {
    if (tamaño > 12) tamaño -= 2;
    aplicarTamaño();
});

// ------------------------------
//  INICIALIZACIÓN
// ------------------------------
aplicarTema(localStorage.getItem("tema") || "claro");
aplicarTamaño();