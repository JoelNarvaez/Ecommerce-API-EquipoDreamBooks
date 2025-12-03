const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { 
    obtenerUserPorCorreo,
    actualizarIntentosFallidos,
    bloquearUser,
    resetearIntentos
} = require("../../models/usersModel");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Buscar usuario
    const user = await obtenerUserPorCorreo(email);

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // esta bloqueado?
    if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
        return res.status(403).json({
            message: `Cuenta bloqueada`
        });
    }

    // Comparar 
    const passwordCorrecta = await bcrypt.compare(password, user.contraseña);

    if (!passwordCorrecta) {
        const nuevosIntentos = user.intentos_fallidos + 1;

        // Actualizar intentos
        await actualizarIntentosFallidos(email, nuevosIntentos);

        // llego al limite?
        if (nuevosIntentos >= 3) {
            const bloqueo = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
            await bloquearUser(email, bloqueo);

            return res.status(403).json({
                message: "Cuenta bloqueada por 5 minutos."
            });
        }

        return res.status(401).json({
            message: `Credenciales invalidas.`
        });
    }

    // contraseña corecta
    await resetearIntentos(email);

    // Generación de TOKEN JWT
        const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            rol: user.rol
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        token: token,
        user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
        }
    });
};
