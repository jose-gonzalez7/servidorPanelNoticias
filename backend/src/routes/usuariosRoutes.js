const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../Middleware/verificarToken");
const usuarioController = require("../controllers/usuarioController");

//rutas para devolver usuarios
router.get("/", verifyToken, usuarioController.getAllUsers);
router.get("/admin", verifyToken, requireRole("administrador"), usuarioController.getAllUsersAdmin);

//rutas para crear, actualizar y eliminar usuarios 
router.post("/", verifyToken, requireRole("administrador"), usuarioController.createUser);
router.put("/", verifyToken, requireRole("administrador"), usuarioController.modificarUser);
router.delete("/", verifyToken, requireRole("administrador"), usuarioController.deleteUser);

module.exports = router;