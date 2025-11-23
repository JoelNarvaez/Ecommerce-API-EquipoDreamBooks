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

        // Reiniciar captcha después de cada intento
        if (typeof turnstile !== "undefined") {
            turnstile.reset();
        }

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text: result.user.nombre
            });

            localStorage.setItem("token", result.token);

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
