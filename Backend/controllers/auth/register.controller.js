const bcrypt = require("bcryptjs");
const { crearUser, obtenerUserPorId } = require("../../models/usersModel");

exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, telefono, pais } = req.body;

        if (!nombre || !email || !password || !telefono || !pais) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si el correo ya existe
        const userExists = await obtenerUserPorId(email);
        if (userExists) {
            return res.status(409).json({ message: "El correo ya está registrado" });
        }

        const hash = await bcrypt.hash(password, 10);

        // Registrar usuario nuevo
        await crearUser(nombre, email, hash, "usuario", telefono, pais);

        return res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
