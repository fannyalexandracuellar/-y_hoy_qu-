
const express = require("express");
const router = express.Router();

const {
    crearSolicitud,
    obtenerMisSolicitudes,
    obtenerTodasLasSolicitudes,
    actualizarEstadoSolicitud
} = require("../controllers/SolicitudController");

const upload = require("../middleware/upload");

const {
    verificarToken,
    verificarAdmin
} = require("../middleware/authMiddleware");

// Consultar todas las solicitudes (Solo administrador)
router.get(
    "/",
    verificarToken,
    verificarAdmin,
    obtenerTodasLasSolicitudes
);

// Consultar solicitudes propias (Cliente autenticado)
router.get(
    "/mis-solicitudes",
    verificarToken,
    obtenerMisSolicitudes
);

// Crear solicitud (Cliente autenticado)
router.post(
    "/",
    verificarToken,
    upload.single("fotografia"),
    crearSolicitud
);

// Actualizar estado (Solo administrador)
router.patch(
    "/:id/estado",
    verificarToken,
    verificarAdmin,
    actualizarEstadoSolicitud
);

module.exports = router;
