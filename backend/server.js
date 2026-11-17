
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();


const solicitudRoutes = require("./routes/solicitudRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactoRoutes = require("./routes/contactoRoutes");



app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
    res.send("¡Bienvenido al servidor de ¿Y hoy qué?!");
});



app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contacto", contactoRoutes);



mongoose.connect(process.env.MONGODB_URI)
    .then(() => {

        console.log("MongoDB conectado correctamente");

        const PORT = process.env.PORT || 3001;

        app.listen(PORT, () => {
            console.log(
                `Servidor funcionando en http://localhost:${PORT}`
            );
        });

    })
    .catch((error) => {
        console.error(
            "Error al conectar MongoDB:",
            error.message
        );
    });
