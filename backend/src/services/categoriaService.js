const prisma = require("../prisma/client");

async function listCategories() {
  try {
    return await prisma.categoria.findMany();
  } catch (error) {
    console.error("Error al listar categorías:", error);
    throw new Error("No se pudo obtener la lista de categorías");
  }
}

async function createCategory(data) {
  try {
    return await prisma.categoria.create({ data });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    throw new Error("No se pudo crear la categoría");
  }
}

async function updateCategory(id, data) {
  try {
    return await prisma.categoria.update({
      where: { id_categoria: id },
      data,
    });
  } catch (error) {
    console.error(`Error al actualizar la categoría con id ${id}:`, error);
    throw new Error("No se pudo actualizar la categoría");
  }
}

async function deleteCategory(id) {
  try {
    return await prisma.categoria.delete({
      where: { id_categoria: id },
    });
  } catch (error) {
    console.error(`Error al eliminar la categoría con id ${id}:`, error);
    throw new Error("No se pudo eliminar la categoría");
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
