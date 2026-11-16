
const express = require("express");
const router = express.Router();

const {
    registrarUsuario,
    iniciarSesion,
    obtenerPerfil
} = require("../controllers/AuthController");

const { verificarToken } = require("../middleware/authMiddleware");

// Registrar usuario
router.post("/registro", registrarUsuario);

// Iniciar sesión
router.post("/login", iniciarSesion);

// Consultar perfil del usuario autenticado
router.get("/perfil", verificarToken, obtenerPerfil);

module.exports = router;
