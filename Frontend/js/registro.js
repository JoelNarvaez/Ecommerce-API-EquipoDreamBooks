const formRegistro = document.getElementById("form-registro");

formRegistro.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre-registro").value.trim();
    const apellidos = document.getElementById("apellidos-registro").value.trim();
    const nombreCompleto = `${nombre} ${apellidos}`.trim();

    const email = document.getElementById("email-registro").value.trim();
    const password = document.getElementById("password-registro").value.trim();
    const password2 = document.getElementById("password2-registro").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const pais = document.getElementById("pais").value.trim();

    /* ============================
          VALIDACIONES
    ============================ */

    // 1. Vacíos
    if (!nombre || !apellidos || !email || !password || !password2 || !telefono || !pais) {
        return Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Todos los campos son obligatorios."
        });
    }

    // 2. Nombre y apellidos sin números
    const regexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
    if (!regexSoloLetras.test(nombre) || !regexSoloLetras.test(apellidos)) {
        return Swal.fire({
            icon: "error",
            title: "Nombre inválido",
            text: "El nombre y apellido solo pueden contener letras."
        });
    }

    // 3. Validación de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        return Swal.fire({
            icon: "error",
            title: "Correo inválido",
            text: "Introduce un correo electrónico válido."
        });
    }

    // 4. Contraseñas iguales
    if (password !== password2) {
        return Swal.fire({
            icon: "error",
            title: "Las contraseñas no coinciden",
            text: "Escríbelas correctamente."
        });
    }

    // 5. Validación de contraseña fuerte
    const regexPasswordFuerte =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!regexPasswordFuerte.test(password)) {
        return Swal.fire({
            icon: "warning",
            title: "Contraseña insegura",
            html: `
                La contraseña debe contener:<br>
                • Mínimo <strong>8 caracteres</strong><br>
                • Al menos <strong>1 mayúscula</strong><br>
                • Al menos <strong>1 minúscula</strong><br>
                • Al menos <strong>1 número</strong><br>
                • Al menos <strong>1 símbolo</strong> (.,!@#$% etc.)
            `
        });
    }

    // 6. Validación de teléfono
    const regexTelefono = /^[0-9]{8,15}$/;
    if (!regexTelefono.test(telefono)) {
        return Swal.fire({
            icon: "error",
            title: "Teléfono inválido",
            text: "Debe contener solo números y tener entre 8 y 15 dígitos."
        });
    }

    // 7. Validación de país
    if (pais === "" || pais === "0") {
        return Swal.fire({
            icon: "error",
            title: "País inválido",
            text: "Selecciona un país válido."
        });
    }

    /* ============================
          ENVÍO AL SERVIDOR
    ============================ */
    try {
        const respuesta = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: nombreCompleto,
                email,
                password,
                telefono,
                pais
            })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            return Swal.fire({
                icon: "error",
                title: "Error en registro",
                text: data.message || "Intenta nuevamente."
            });
        }

        Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "Tu cuenta fue creada correctamente."
        }).then(() => {
            window.location.href = "login.html";
        });

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor."
        });
    }
});
