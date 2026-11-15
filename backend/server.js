
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configuración del servidor
app.use(cors());
app.use(express.json());

// Ruta principal de prueba
app.get("/", (req, res) => {
    res.send("¡Bienvenido al servidor de ¿Y hoy qué?!");
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
