document.getElementById("formLogin").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const captchaToken = document.querySelector("[name='cf-turnstile-response']").value;

    const data = { email, password, captchaToken };

    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Respuesta del backend:", result);
        // Reiniciar captcha después de cada intento
        if (typeof turnstile !== "undefined") {
            turnstile.reset();
        }

        if (response.ok) {
            await Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text: result.user.nombre,
                timer: 1500,
                showConfirmButton: false
            });

            localStorage.setItem("token", result.token);
            localStorage.setItem("userName", result.user.nombre);
            localStorage.setItem("userRole", result.user.rol);

            // Validación de rol 
            if(result.user.rol === "admin"){
                window.location.href = "/Frontend/pages/admin/panel_admin.html";
                return;
            }else{
                window.location.href = "/Frontend/pages/index.html";
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: result.message
            });
        }

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor"
        });
    }
});
