const base = window.location.pathname.includes("/pages/")
  ? "../" 
  : "";
// accesibilidad-por-usuario.js
document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // CONFIG
  // ============================
  const USUARIO_KEY = "usuarioActual";

  // ============================
  // UTIL
  // ============================
  function getUsuarioActual() {
    return localStorage.getItem(USUARIO_KEY) || null;
  }

  // SOLO REGRESA UNA KEY SI HAY USUARIO LOGEADO
  function getKey(key) {
    const usuario = getUsuarioActual();
    if (!usuario) return null;        // <<< NO GUARDAR NADA SIN LOGIN
    return `${usuario}_${key}`;
  }

  // ============================
  // ELEMENTOS
  // ============================
  const btnPanel = document.getElementById("btnAccesibilidad");
  const panel = document.getElementById("panelAccesibilidad");
  const btnTema = document.getElementById("btnTema");
  const iconTema = document.getElementById("iconTema");
  const btnTextoMas = document.getElementById("textoMas");
  const btnTextoMenos = document.getElementById("textoMenos");

  const imgTema = document.getElementById("imgTema");

  function setIconToMoon() {
      imgTema.src = base + "imagenes/luna-icono.png";
  }

  function setIconToSun() {
      imgTema.src = base + "imagenes/sol-icono.png";
  }

  // ============================
  // PANEL
  // ============================
  if (btnPanel && panel) {
    btnPanel.addEventListener("click", () => {
      panel.classList.toggle("activo");
    });
  }

  // ============================
  // MODO CLARO / OSCURO
  // ============================
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
      const usuarioKey = getKey("tema");

      // Si NO hay usuario → NO guardar → solo cambiar visualmente
      let temaActual;
      if (!usuarioKey) {
        temaActual = document.body.classList.contains("modo-oscuro")
          ? "oscuro"
          : "claro";
      } else {
        temaActual = localStorage.getItem(usuarioKey) || "claro";
      }

      const nuevoTema = temaActual === "claro" ? "oscuro" : "claro";

      if (usuarioKey) localStorage.setItem(usuarioKey, nuevoTema);

      aplicarTema(nuevoTema);
    });
  }

  // ============================
  // CONTROL DE TAMAÑO TEXTO
  // ============================
  let tamañoBase = 16;
  let tamañoGuardado = null;

  const usuarioTamKey = getKey("textoTamano");
  if (usuarioTamKey) {
    tamañoGuardado = parseInt(localStorage.getItem(usuarioTamKey), 10);
  }

  if (!tamañoGuardado || Number.isNaN(tamañoGuardado)) {
    tamañoGuardado = tamañoBase;
  }

  let tamaño = tamañoGuardado;

  function aplicarTamaño() {
    document.documentElement.style.fontSize = tamaño + "px";

    const clave = getKey("textoTamano");
    if (clave) localStorage.setItem(clave, String(tamaño));
  }

  if (btnTextoMas) {
    btnTextoMas.addEventListener("click", () => {
      if (tamaño < 22) tamaño += 2;
      aplicarTamaño();
    });
  }

  if (btnTextoMenos) {
    btnTextoMenos.addEventListener("click", () => {
      if (tamaño > 16) tamaño -= 2;
      aplicarTamaño();
    });
  }

  // ============================
  // INICIALIZACIÓN
  // ============================
  const usuarioTemaKey = getKey("tema");
  const temaGuardado = usuarioTemaKey
    ? localStorage.getItem(usuarioTemaKey) || "claro"
    : "claro"; // <<< SIN USUARIO, FORZAR DEFAULT

  aplicarTema(temaGuardado);
  aplicarTamaño();

  // ============================
  // FUNCIONES AUX (consola)
  // ============================
  window.loginAs = function (username) {
    if (!username) return console.warn("loginAs: pasa un nombre");
    localStorage.setItem(USUARIO_KEY, username);
    console.log("Simulando login:", username);

    const temaKey = getKey("tema");
    const tamKey = getKey("textoTamano");

    const tema = temaKey ? localStorage.getItem(temaKey) || "claro" : "claro";
    const tam = tamKey ? parseInt(localStorage.getItem(tamKey), 10) || 16 : 16;

    tamaño = tam;
    aplicarTema(tema);
    aplicarTamaño();
  };

  window.logout = function () {
    console.log("Cerrando sesión…");
    localStorage.removeItem(USUARIO_KEY);

    // Restaurar DEFAULTS sin guardar
    tamaño = 16;
    aplicarTema("claro");
    aplicarTamaño();

    console.log("Logout completo. Sin usuario = sin guardar preferencias.");
  };

  window.printAccesibilidadStorage = function () {
    console.log("Contenido localStorage:", JSON.parse(JSON.stringify(localStorage)));
  };
});
