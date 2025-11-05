const prisma = require("../prisma/client");

async function listCategories() {
  return await prisma.categoria.findMany();
}

async function createCategory(data) {
  return await prisma.categoria.create({ data });
}

async function updateCategory(id, data) {
  return await prisma.categoria.update({
    where: { id_categoria: id },
    data
  });
}

async function deleteCategory(id) {
  return await prisma.categoria.delete({
    where: { id_categoria: id },
  });
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
