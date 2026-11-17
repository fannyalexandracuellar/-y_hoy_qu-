const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");


const carpetaUploads = path.join(__dirname, "../uploads");


fs.mkdirSync(carpetaUploads, { recursive: true });


const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpetaUploads);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const nombreArchivo = `${randomUUID()}${extension}`;

        cb(null, nombreArchivo);
    }
});


const filtroArchivos = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten archivos de imagen."));
    }
};


const upload = multer({
    storage: almacenamiento,
    fileFilter: filtroArchivos,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;