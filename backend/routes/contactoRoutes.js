
const express = require("express");
const router = express.Router();

const {
    crearMensaje,
    obtenerMensajes,
    actualizarEstadoMensaje
} = require("../controllers/ContactoController");

const {
    verificarToken,
    verificarAdmin
} = require("../middleware/authMiddleware");

// Enviar mensaje (público, no requiere iniciar sesión)
router.post("/", crearMensaje);

// Consultar mensajes (solo administrador)
router.get(
    "/",
    verificarToken,
    verificarAdmin,
    obtenerMensajes
);

// Actualizar estado (solo administrador)
router.patch(
    "/:id/estado",
    verificarToken,
    verificarAdmin,
    actualizarEstadoMensaje
);

module.exports = router;
