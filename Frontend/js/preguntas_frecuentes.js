//  Función para activar las preguntas frecuentes 
function activarPreguntasFrecuentes() {
  const acordeon = document.getElementsByClassName('contenedor-preguntas');

  for (let i = 0; i < acordeon.length; i++) {
    acordeon[i].addEventListener('click', function() {
      this.classList.toggle('active')
    });
  }
}

// --- Ejecutar al cargar la página ---
document.addEventListener('DOMContentLoaded', function() {
  activarPreguntasFrecuentes();
});
