
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


router.get(
    "/",
    verificarToken,
    verificarAdmin,
    obtenerTodasLasSolicitudes
);


router.get(
    "/mis-solicitudes",
    verificarToken,
    obtenerMisSolicitudes
);


router.post(
    "/",
    verificarToken,
    upload.single("fotografia"),
    crearSolicitud
);


router.patch(
    "/:id/estado",
    verificarToken,
    verificarAdmin,
    actualizarEstadoSolicitud
);

module.exports = router;
