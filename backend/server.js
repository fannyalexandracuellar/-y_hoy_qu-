
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

require("dotenv").config();

const app = express();

// Importar rutas
const solicitudRoutes = require("./routes/solicitudRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactoRoutes = require("./routes/contactoRoutes");

// Middlewares generales
app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "¡Bienvenido al servidor de ¿Y hoy qué?!"
    });
});

// Rutas de la API
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contacto", contactoRoutes);

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        mensaje: "La ruta solicitada no existe.",
        ruta: req.originalUrl
    });
});

// Manejo general de errores
app.use((error, req, res, next) => {
    console.error("Error en el servidor:", error.message);

    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            mensaje: "Error al procesar el archivo.",
            error: error.message
        });
    }

    if (error.message === "Solo se permiten archivos de imagen.") {
        return res.status(400).json({
            mensaje: error.message
        });
    }

    return res.status(500).json({
        mensaje: "Ocurrió un error interno en el servidor."
    });
});

// Conexión a MongoDB y arranque del servidor
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB conectado correctamente");

        const PORT = process.env.PORT || 3001;

        app.listen(PORT, () => {
            console.log(`Servidor funcionando en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "Error al conectar MongoDB:",
            error.message
        );
    });
