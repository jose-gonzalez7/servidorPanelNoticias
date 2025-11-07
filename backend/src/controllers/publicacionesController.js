const publicacionesService = require('../services/publicacionesService');

async function getAllPublicaciones(req, res) {
  console.log('=== 🔹 Solicitud GET /publicaciones 🔹 ===');
  console.log('Usuario que hace la petición:', req.user); // del middleware verifyToken
    
    try {
        const publicaciones = await publicacionesService.listPublicaciones();   
        res.json(publicaciones);
    } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        res.status(500).json({ error: 'Error al obtener publicaciones' });
    }
}

async function createPublicacion(req, res) {
  console.log('=== 🔹 Solicitud POST /publicaciones 🔹 ===');
  console.log('Usuario que hace la petición:', req.user);
  console.log('Datos de la nueva publicación:', req.body);

  try {
    const nuevaPublicacion = await publicacionesService.createPublicacion(req.body);
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ error: 'Error al crear publicación' });
  }
};

async function updatePublicacion(req, res) {
  console.log('=== 🔹 Solicitud PUT /publicaciones 🔹 ===');
  console.log('Usuario que hace la petición:', req.user);
  console.log('Datos recibidos:', req.body);

  // 🔹 Separar ID del resto de los datos
  const { id_publicacion, ...data } = req.body;

  if (!id_publicacion) {
    return res.status(400).json({ error: "Falta id_publicacion en el body" });
  }

  try {
    const publicacionActualizada = await publicacionesService.updatePublicacion(id_publicacion, data);
    res.json(publicacionActualizada);
  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deletePublicacion(req, res) {
  console.log('=== 🔹 Solicitud DELETE /publicaciones/:id 🔹 ===');
  console.log('Usuario que hace la petición:', req.user);
  console.log('ID de la publicación a eliminar:', req.body.id_publicacion);

  try {
    await publicacionesService.deletePublicacion(req.body.id_publicacion);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar publicación:', error);
    res.status(500).json({ error: 'Error al eliminar publicación' });
  }
}

async function emailPublicacionController(req, res) {
  console.log("=== 🔹 Solicitud POST /publicaciones/emailPublicaciones 🔹 ===");
  console.log("Usuario que hace la petición:", req.user);
  console.log("Datos recibidos para enviar email de publicación:", req.body);
  const { id_publicacion, destinatarios } = req.body;

  try {
    const result = await publicacionesService.emailPublicacion(id_publicacion, destinatarios);
    res.json(result);
  } catch (error) {
    console.error("Error al enviar email de publicación:", error.message);
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getAllPublicaciones,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
  emailPublicacionController
};