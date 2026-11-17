
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

// Consultar todas las solicitudes (solo administrador)
router.get(
    "/",
    verificarToken,
    verificarAdmin,
    obtenerTodasLasSolicitudes
);

// Consultar solicitudes del usuario
router.get(
    "/mis-solicitudes",
    verificarToken,
    obtenerMisSolicitudes
);

// Crear una solicitud
router.post(
    "/",
    (req, res, next) => {
        console.log("POST /api/solicitudes RECIBIDO");
        next();
    },
    verificarToken,
    upload.single("fotografia"),
    crearSolicitud
);

// Actualizar estado (solo administrador)
router.patch(
    "/:id/estado",
    verificarToken,
    verificarAdmin,
    actualizarEstadoSolicitud
);

module.exports = router;
