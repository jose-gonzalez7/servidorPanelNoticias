const prisma = require("../prisma/client");

async function listPublicaciones() {
  try {
    const publicaciones = await prisma.publicaciones.findMany();
    return publicaciones;
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);

    // Puedes lanzar el error para que el controlador lo maneje
    throw new Error("No se pudo obtener la lista de publicaciones");

    // O devolver un objeto con error (menos recomendado)
    // return { error: "No se pudo obtener la lista de publicaciones" };
  }
}

module.exports = {
  listPublicaciones,
};