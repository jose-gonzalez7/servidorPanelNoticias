const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../Middleware/verificarToken");
const publicacionesController = require("../controllers/publicacionesController");

// Ruta para obtener todas las publicaciones
router.get("/", verifyToken, requireRole("administrador", "editor"), publicacionesController.getAllPublicaciones);

// Ruta para crear una nueva publicación
router.post("/", verifyToken, requireRole("administrador"), publicacionesController.createPublicacion);

// Ruta para actualizar una publicación existente
router.put("/", verifyToken, requireRole("administrador"), publicacionesController.updatePublicacion);

// Ruta para eliminar una publicación
router.delete("/", verifyToken, requireRole("administrador"), publicacionesController.deletePublicacion);

module.exports = router;