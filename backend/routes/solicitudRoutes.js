const express = require("express");
const router = express.Router();

const { crearSolicitud } = require("../controllers/SolicitudController");
const upload = require("../middleware/upload");

// Ruta para recibir el formulario y su fotografía
router.post("/", upload.single("fotografia"), crearSolicitud);

module.exports = router;