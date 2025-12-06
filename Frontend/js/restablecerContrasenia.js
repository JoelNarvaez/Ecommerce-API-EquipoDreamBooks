const form = document.getElementById("resetForm");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const submitBtn = document.getElementById("resetBtn");

// 1. OBTENER TOKEN DESDE LA URL
const urlParametro = new URLSearchParams(window.location.search);
const token = urlParametro.get("token");

// Si no hay token, redirigir a la página principal
if (!token) {
  Swal.fire({
    icon: "error",
    title: "Token no encontrado",
    text: "El token de restablecimiento no fue encontrado en la URL.",
  }).then((result) => {
    /*window.location.href = "http://127.0.0.1:5501../pages/index.html";*/
    window.location.href = "https://ecommerce-api-equipodreambooks-production.up.railway.app../pages/index.html";
  });
} else {
  verifyToken(token);
}

// 2. VERIFICAR TOKEN CON BACKEND
async function verifyToken(token) {
  try {
    const res = await fetch(
      /*`http://localhost:3000/api/auth/verify-reset-token/${token}`*/
      `https://ecommerce-api-equipodreambooks-production.up.railway.app/api/auth/verify-reset-token/${token}`
    );
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Token Invalido",
        text: "El token de restablecimiento es inválido o ha expirado, intenta de nuevo.",
      }).then((result) => {
        window.location.href =
          /*"http://127.0.0.1:5501../pages/index.html";*/
          "https://ecommerce-api-equipodreambooks-production.up.railway.app../pages/index.html";
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Token Valido",
      text: "Token verificado correctamente. Ya puedes cambiar tu contraseña",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error de Servidor",
      text: "No se pudo verificar el token. Intenta nuevamente más tarde.",
    });
  }
}

// 3. ENVÍO DEL FORMULARIO CON TOKEN
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const contrasenia = passwordInput.value.trim();
  const confirmContrasenia = confirmPasswordInput.value.trim();

  if (!contrasenia || !confirmContrasenia) {
    Swal.fire({
      icon: "warning",
      title: "Datos incompletos",
      text: "Todos los campos son obligatorios.",
    });
    return;
  }

  if (contrasenia !== confirmContrasenia) {
    Swal.fire({
      icon: "warning",
      title: "Contraseñas no coinciden",
      text: "Asegúrate de que las contraseñas ingresadas sean iguales.",
    });
    return;
  }

  if (!validarContrasenia(contrasenia)) {
    Swal.fire({
      icon: "warning",
      title: "Contraseña insegura",
      text: "Debe tener mínimo 8 caracteres, mayúscula, número y símbolo",
    });
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Actualizando...";

  try {
    const response = await fetch(
      /*`http://localhost:3000/api/auth/reset-password/${token}`,*/
      `https://ecommerce-api-equipodreambooks-production.up.railway.app/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: contrasenia }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Error al restablecer",
        text:
          "Eror al restablecer la contraseña: " +
          (data.message || "Intenta nuevamente"),
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Contraseña actualizada",
      text: "Contraseña actualizada correctamente",
    }).then((result) => {
      /*window.location.href = "http://127.0.0.1:5501../pages/login.html";*/
      window.location.href = "https://ecommerce-api-equipodreambooks-production.up.railway.app../pages/login.html";
    });

    form.reset();
  } catch (error) {

    Swal.fire({
      icon: "error",
      title: "Error al restablecer",
      text: error.message,
    });
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Guardar nueva contraseña";
  }
});

// 4. VALIDAR SEGURIDAD DE CONTRASEÑA
function validarContrasenia(contrasenia) {
  return contrasenia.length >= 8;
}
