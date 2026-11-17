
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

// Consultar estadísticas (Solo administrador)
router.get(
    "/estadisticas",
    verificarToken,
    verificarAdmin,
    obtenerEstadisticas
);

// Consultar clientes (Solo administrador)
router.get(
    "/clientes",
    verificarToken,
    verificarAdmin,
    obtenerClientes
);

module.exports = router;
