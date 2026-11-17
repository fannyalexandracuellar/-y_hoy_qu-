
const express = require("express");
const router = express.Router();

const {
    obtenerEstadisticas,
    obtenerClientes
} = require("../controllers/AdminController");

const {
    verificarToken,
    verificarAdmin
} = require("../middleware/authMiddleware");


router.get(
    "/estadisticas",
    verificarToken,
    verificarAdmin,
    obtenerEstadisticas
);


router.get(
    "/clientes",
    verificarToken,
    verificarAdmin,
    obtenerClientes
);

module.exports = router;
