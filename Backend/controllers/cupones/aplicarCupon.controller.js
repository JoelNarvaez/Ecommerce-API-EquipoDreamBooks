const { obtenerCuponPorCodigo } = require("../../models/modelCupon");

exports.aplicarCupon = async (req, res) => {
    try {
        const { codigo } = req.body;
        if (!codigo)
            return res.status(400).json({ ok: false, message: "Debes enviar un código." });

        const cupon = await obtenerCuponPorCodigo(codigo);

        if (!cupon)
            return res.status(404).json({ ok: false, message: "Cupón inválido o expirado." });

        return res.status(200).json({
            ok: true,
            message: "Cupón válido.",
            cupon
        });

    } catch (error) {
        console.error("Error cupón:", error);
        return res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
};
