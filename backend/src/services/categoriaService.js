const e = require("express");
const prisma = require("../prisma/client");

async function listCategories() {
  try {
    return await prisma.categoria.findMany();
  } catch (error) {
    throw new Error(error.message || "No se pudo obtener la lista de categorías");
  }
}

async function createCategory(data) {
  try {
    return await prisma.categoria.create({ data });
  } catch (error) {
    throw new Error(error.message || "No se pudo crear la categoría");
  }
}

async function updateCategory(id, data) {
  try {
    return await prisma.categoria.update({
      where: { id_categoria: id },
      data,
    });
  } catch (error) {
    throw new Error(error.message || "No se pudo actualizar la categoría");
  }
}

async function deleteCategory(id) {
  try {
    return await prisma.categoria.delete({
      where: { id_categoria: id },
    });
  } catch (error) {
    throw new Error(error.message || "No se pudo eliminar la categoría");
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
