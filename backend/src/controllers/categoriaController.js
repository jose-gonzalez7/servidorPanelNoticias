const categoriaService = require('../services/categoriaService');

async function getAllCategories(req, res) {
  console.log('=== 🔹 Solicitud GET /categorias 🔹 ===');
  console.log('Usuario que hace la petición:', req.user); // del middleware verifyToken
  
  try {
    const categories = await categoriaService.listCategories();
    console.log('Categorías obtenidas:', categories);
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
}

async function createCategory(req, res) {
    console.log('=== 🔹 Solicitud POST /categorias 🔹 ===');
    console.log('Usuario que hace la petición (admin):', req.user);
    console.log('Datos recibidos para crear categoría:', req.body);

  try {
    const newCategory = await categoriaService.createCategory(req.body);
    console.log('Categoría creada:', newCategory);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
}

async function updateCategory(req, res) {
  console.log('=== 🔹 Solicitud PUT /categorias/:id 🔹 ===');
  console.log('Usuario que hace la petición (admin):', req.user);
  console.log('Datos recibidos para actualizar categoría:', req.body);
  
  try {
    const categoryId = req.body.id_categoria;
    const nuevoNombre = req.body.nuevoNombre;

    const updatedCategory = await categoriaService.updateCategory(categoryId, { nombre: nuevoNombre });

    console.log('Categoría actualizada:', updatedCategory);
    res.json({ message: 'Categoría actualizada correctamente', categoria: updatedCategory });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
}


async function deleteCategory(req, res) {
  const { id_categoria } = req.body;
  console.log("ID de la categoría a eliminar:", id_categoria);

  try {
    await categoriaService.deleteCategory(id_categoria);
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
}


module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
