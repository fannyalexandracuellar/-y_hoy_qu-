
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registrarUsuario = async (req, res) => {
    try {
        const { nombre, correo, telefono, contrasena } = req.body;

        if (!nombre || !correo || !telefono || !contrasena) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios."
            });
        }

        if (contrasena.length < 8) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener al menos 8 caracteres."
            });
        }

        const correoExistente = await Usuario.findOne({
            correo: correo.trim().toLowerCase()
        });

        if (correoExistente) {
            return res.status(409).json({
                mensaje: "Este correo ya está registrado."
            });
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 12);

        const nuevoUsuario = await Usuario.create({
            nombre,
            correo,
            telefono,
            contrasena: contrasenaEncriptada,
            rol: "cliente"
        });

        res.status(201).json({
            mensaje: "Usuario registrado correctamente.",
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo,
                telefono: nuevoUsuario.telefono,
                rol: nuevoUsuario.rol
            }
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                mensaje: "Este correo ya está registrado."
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                mensaje: "Los datos enviados no son válidos."
            });
        }

        res.status(500).json({
            mensaje: "Error interno al registrar el usuario."
        });
    }
};


const iniciarSesion = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({
                mensaje: "Debes ingresar correo y contraseña."
            });
        }

        const usuario = await Usuario.findOne({
            correo: correo.trim().toLowerCase()
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        const contrasenaValida = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        if (!contrasenaValida) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        const token = jwt.sign(
            {
                id: usuario._id,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso.",
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                telefono: usuario.telefono,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);

        res.status(500).json({
            mensaje: "Error interno al iniciar sesión."
        });
    }
};


const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id)
            .select("-contrasena");

        if (!usuario) {
            return res.status(404).json({
                mensaje: "No se encontró el usuario."
            });
        }

        res.status(200).json({
            mensaje: "Perfil obtenido correctamente.",
            usuario
        });

    } catch (error) {
        console.error("Error al consultar el perfil:", error.message);

        res.status(500).json({
            mensaje: "Error al consultar el perfil."
        });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion,
    obtenerPerfil
};
