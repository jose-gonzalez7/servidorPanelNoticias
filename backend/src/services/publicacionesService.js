const e = require("express");
const prisma = require("../prisma/client");

// 🧾 Obtener todas las publicaciones
async function listPublicaciones() {
  try {
    const publicaciones = await prisma.publicaciones.findMany();
    return publicaciones;
  } catch (error) {
    throw new Error(error.message || "No se pudo obtener la lista de publicaciones");
  }
}

// 🆕 Crear una nueva publicación
async function createPublicacion(data) {
  try {
    // Convertir fechas si existen y vienen como string
    if (data.fecha_inicio) data.fecha_inicio = new Date(data.fecha_inicio);
    if (data.fecha_fin) data.fecha_fin = new Date(data.fecha_fin);

    const nuevaPublicacion = await prisma.publicaciones.create({ data });
    return nuevaPublicacion;
  } catch (error) {
    throw new Error(error.message || "No se pudo crear la publicación");
  }
}

// ✏️ Actualizar una publicación existente
async function updatePublicacion(id, data) {
  try {
    // ✅ Convertir fechas a Date si vienen como string
    if (data.fecha_inicio) data.fecha_inicio = new Date(data.fecha_inicio);
    if (data.fecha_fin) data.fecha_fin = new Date(data.fecha_fin);

    // ❌ Asegurarse de no intentar actualizar la clave primaria
    delete data.id_publicacion;

    const publicacionActualizada = await prisma.publicaciones.update({
      where: { id_publicacion: id }, // ID separado del body
      data, // Solo campos modificables
    });

    return publicacionActualizada;
  } catch (error) {
    // Manejo de error específico de Prisma
    if (error.code === 'P2025') {
      throw new Error(`No se encontró la publicación con id_publicacion=${id}`);
    }

    throw new Error(error.message || "No se pudo actualizar la publicación");
  }
}

// 🗑️ Eliminar una publicación
async function deletePublicacion(id) {
  try {
    await prisma.publicaciones.delete({
      where: { id_publicacion: id }, 
    });
  } catch (error) {
    throw new Error(error.message || "No se pudo eliminar la publicación");
  }
}

module.exports = {
  listPublicaciones,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
};
