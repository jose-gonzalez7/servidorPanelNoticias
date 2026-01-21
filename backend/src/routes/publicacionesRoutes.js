const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../Middleware/verificarToken");
const publicacionesController = require("../controllers/publicacionesController");

// Ruta para obtener todas las publicaciones
router.get("/", verifyToken, requireRole("administrador", "editor", "profesor"), publicacionesController.getAllPublicaciones);

// Ruta para crear una nueva publicación
router.post("/", verifyToken, requireRole("administrador", "editor"), publicacionesController.createPublicacion);

// Ruta para actualizar una publicación existente
router.put("/", verifyToken, requireRole("administrador", "editor"), publicacionesController.updatePublicacion);

// Ruta para eliminar una publicación
router.delete("/", verifyToken, requireRole("administrador", "editor"), publicacionesController.deletePublicacion);

// Endpoint dedicado a enviar email de publicación
router.post("/emailPublicaciones", verifyToken ,requireRole("administrador", "editor"), publicacionesController.emailPublicacionController);

router.get("/actividad", publicacionesController.devolverActividad);

module.exports = router;