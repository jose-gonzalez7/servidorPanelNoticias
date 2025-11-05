const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../Middleware/verificarToken");
const categoriaController = require("../controllers/categoriaController");

//rutas para devolver categorías
router.get("/", verifyToken, requireRole("administrador", "editor"), categoriaController.getAllCategories);

//rutas para crear, actualizar y eliminar categorías
router.post("/", verifyToken, requireRole("administrador"), categoriaController.createCategory);
//router.put("/", verifyToken, requireRole("administrador"), categoriaController.updateCategory);
router.delete("/", verifyToken, requireRole("administrador"), categoriaController.deleteCategory);

module.exports = router;
