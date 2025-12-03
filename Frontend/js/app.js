// accesibilidad-por-usuario.js
document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------
  // CONFIG
  // ----------------------------
  // Nombre de la clave global donde guardas el usuario activo
  // Ejemplo de uso: localStorage.setItem("usuarioActual", "juanito");
  const USUARIO_KEY = "usuarioActual";

  // ============================
  // UTIL / KEYS
  // ============================
  function getUsuarioActual() {
    return localStorage.getItem(USUARIO_KEY) || null;
  }

  function getKey(key) {
    const usuario = getUsuarioActual();
    return usuario ? `${usuario}_${key}` : key; // si no hay usuario usa llave global (útil para pruebas)
  }

  // ============================
  // ELEMENTOS (comprueba existencia)
  // ============================
  const btnPanel = document.getElementById("btnAccesibilidad");
  const panel = document.getElementById("panelAccesibilidad");
  const btnTema = document.getElementById("btnTema");
  const iconTema = document.getElementById("iconTema");
  const btnTextoMas = document.getElementById("textoMas");
  const btnTextoMenos = document.getElementById("textoMenos");

  // Helpers seguros para manipular icono
  function setIconToSun() {
    if (!iconTema) return;
    iconTema.classList.remove("fa-moon");
    iconTema.classList.add("fa-sun");
  }
  function setIconToMoon() {
    if (!iconTema) return;
    iconTema.classList.remove("fa-sun");
    iconTema.classList.add("fa-moon");
  }

  // ------------------------------
  //  ABRIR / CERRAR PANEL
  // ------------------------------
  if (btnPanel && panel) {
    btnPanel.addEventListener("click", () => {
      panel.classList.toggle("activo");
    });
  } else {
    console.warn("Accesibilidad: btnPanel o panel no encontrados.");
  }

  // ------------------------------
  //  MODO CLARO / OSCURO
  // ------------------------------
  function aplicarTema(tema) {
    if (tema === "oscuro") {
      document.body.classList.add("modo-oscuro");
      setIconToSun();
    } else {
      document.body.classList.remove("modo-oscuro");
      setIconToMoon();
    }
  }

  if (btnTema) {
    btnTema.addEventListener("click", () => {
      try {
        const llave = getKey("tema");
        const temaActual = localStorage.getItem(llave) || "claro";
        const nuevoTema = temaActual === "claro" ? "oscuro" : "claro";
        localStorage.setItem(llave, nuevoTema);
        console.log(`Accesibilidad: guardado ${llave} = ${nuevoTema}`);
        aplicarTema(nuevoTema);
      } catch (err) {
        console.error("Error al cambiar tema:", err);
      }
    });
  } else {
    console.warn("Accesibilidad: btnTema no encontrado.");
  }

  // ------------------------------
  //  CONTROL DE TEXTO
  // ------------------------------
  // valor inicial por usuario (o global si no hay usuario)
  let tamaño = parseInt(localStorage.getItem(getKey("textoTamano")), 10);
  if (!tamaño || Number.isNaN(tamaño)) tamaño = 16;

  function aplicarTamaño() {
    document.documentElement.style.fontSize = tamaño + "px";
    localStorage.setItem(getKey("textoTamano"), String(tamaño));
    console.log(`Accesibilidad: guardado ${getKey("textoTamano")} = ${tamaño}`);
  }

  if (btnTextoMas) {
    btnTextoMas.addEventListener("click", () => {
      if (tamaño < 30) tamaño += 2;
      aplicarTamaño();
    });
  } else {
    console.warn("Accesibilidad: textoMas no encontrado.");
  }

  if (btnTextoMenos) {
    btnTextoMenos.addEventListener("click", () => {
      if (tamaño > 12) tamaño -= 2;
      aplicarTamaño();
    });
  } else {
    console.warn("Accesibilidad: textoMenos no encontrado.");
  }

  // ------------------------------
  //  INICIALIZACIÓN AL CARGAR PAGINA
  // ------------------------------
  // Aplica tema y tamaño guardados (por usuario si hay)
  const temaGuardado = localStorage.getItem(getKey("tema")) || "claro";
  aplicarTema(temaGuardado);
  aplicarTamaño();

  console.info("Accesibilidad iniciada. Usuario actual:", getUsuarioActual());

  // ------------------------------
  //  FUNCIONES AUX PARA PRUEBAS / LOGIN-LOGOUT
  // ------------------------------
  // Estas funciones son para ayudarte a probar el flujo:
  //  - loginAs("juanito") -> simula login (guarda usuarioActual)
  //  - logout() -> quita usuarioActual y recarga para ver defaults
  // Notas: puedes llamarlas desde la consola
  window.loginAs = function (username) {
    if (!username) return console.warn("loginAs: pasa un nombre de usuario");
    localStorage.setItem(USUARIO_KEY, username);
    console.log("Simulando login de:", username);
    // al iniciar sesión debemos aplicar las preferencias de este usuario (si existen)
    const tema = localStorage.getItem(getKey("tema")) || "claro";
    const tam = parseInt(localStorage.getItem(getKey("textoTamano")), 10) || 16;
    // actualizar variables internas
    tamaño = tam;
    aplicarTema(tema);
    aplicarTamaño();
    // recargar para que otras lógicas que dependen del usuario se actualicen si las tienes
    // location.reload(); // descomenta si quieres forzar recarga completa
  };

  window.logout = function () {
    localStorage.removeItem(USUARIO_KEY);
    console.log("Simulando logout. Se ha eliminado usuarioActual.");
    // Al cerrar sesión, aplicamos valores por defecto (globales)
    const temaDefault = localStorage.getItem("tema") || "claro"; // llave global
    const tamDefault = parseInt(localStorage.getItem("textoTamano"), 10) || 16;
    tamaño = tamDefault;
    aplicarTema(temaDefault);
    aplicarTamaño();
    // location.reload(); // descomenta si quieres forzar recarga completa
  };

  // para debugging rápido: mostrar claves relacionadas del usuario en consola
  window.printAccesibilidadStorage = function () {
    const user = getUsuarioActual();
    console.log("Usuario actual:", user);
    console.log("Keys en localStorage relacionadas:");
    Object.keys(localStorage)
      .filter(k => (user ? k.startsWith(user + "_") : k.includes("textoTamano") || k.includes("tema")))
      .forEach(k => console.log(k, "=", localStorage.getItem(k)));
  };
});
