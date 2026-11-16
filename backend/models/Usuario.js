

const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    correo: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },

    telefono: {
        type: String,
        required: true,
        trim: true
    },

    contrasena: {
        type: String,
        required: true
    },

    rol: {
        type: String,
        enum: ["cliente", "administrador"],
        default: "cliente"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Usuario", usuarioSchema);
