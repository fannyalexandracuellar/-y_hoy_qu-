
const express = require("express");
const router = express.Router();

const {
    crearSolicitud,
    obtenerMisSolicitudes
} = require("../controllers/SolicitudController");

const upload = require("../middleware/upload");
const { verificarToken } = require("../middleware/authMiddleware");

// Consultar las solicitudes del usuario autenticado
router.get(
    "/mis-solicitudes",
    verificarToken,
    obtenerMisSolicitudes
);

// Crear una nueva solicitud
router.post(
    "/",
    verificarToken,
    upload.single("fotografia"),
    crearSolicitud
);

module.exports = router;
