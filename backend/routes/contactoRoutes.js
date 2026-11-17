
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


router.post("/", crearMensaje);


router.get(
    "/",
    verificarToken,
    verificarAdmin,
    obtenerMensajes
);


router.patch(
    "/:id/estado",
    verificarToken,
    verificarAdmin,
    actualizarEstadoMensaje
);

module.exports = router;
