
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Configuración del servidor
app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    res.send("¡Bienvenido al servidor de ¿Y hoy qué?!");
});

// Conexión con MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB conectado correctamente");

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Servidor funcionando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar MongoDB:", error.message);
    });

    