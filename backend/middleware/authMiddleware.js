
const jwt = require("jsonwebtoken");

// Verificar el token del usuario
const verificarToken = (req, res, next) => {
    try {
        const encabezado = req.headers.authorization;

        if (!encabezado || !encabezado.startsWith("Bearer ")) {
            return res.status(401).json({
                mensaje: "Acceso denegado. Debes iniciar sesión."
            });
        }

        const token = encabezado.split(" ")[1];

        const datosToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = datosToken;

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: "Sesión inválida o expirada. Inicia sesión nuevamente."
        });
    }
};

// Verificar que el usuario sea administrador
const verificarAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== "administrador") {
        return res.status(403).json({
            mensaje: "No tienes permisos para realizar esta acción."
        });
    }

    next();
};

module.exports = {
    verificarToken,
    verificarAdmin
};
