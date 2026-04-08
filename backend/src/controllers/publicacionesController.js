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
    const nuevaPublicacion = await publicacionesService.createPublicacion(req.body, req.user.id);
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    console.error('Error al crear publicación:', error);
    const msg = error.message || '';
    if (msg.startsWith('VALIDACION:')) {
      return res.status(400).json({
        error: msg.replace(/^VALIDACION:\s*/, ''),
      });
    }
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
    const publicacionActualizada = await publicacionesService.updatePublicacion(
      id_publicacion,
      data,
      req.user.id
    );
    res.json(publicacionActualizada);
  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    const msg = error.message || '';
    if (msg.startsWith('VALIDACION:')) {
      return res.status(400).json({ error: msg.replace(/^VALIDACION:\s*/, '') });
    }
    res.status(500).json({ error: error.message });
  }
}

async function deletePublicacion(req, res) {
  console.log('=== 🔹 Solicitud DELETE /publicaciones/:id 🔹 ===');
  console.log('Usuario que hace la petición:', req.user);
  console.log('ID de la publicación a eliminar:', req.body.id_publicacion);

  try {
    await publicacionesService.deletePublicacion(req.body.id_publicacion, req.user.id);
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
    const result = await publicacionesService.emailPublicacion(
      id_publicacion,
      destinatarios,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    console.error("Error al enviar email de publicación:", error.message);
    res.status(400).json({ error: error.message });
  }
}

async function devolverActividad(req, res) {
  console.log("=== 🔹 Solicitud GET /publicaciones/actividad 🔹 ===");
  console.log("Usuario que hace la petición:", req.user);

  try {
    const actividades = await publicacionesService.devolverActividad(req.user.id);
    res.json(actividades);
  } catch (error) {
    console.error("Error al devolver actividad:", error.message);
    res.status(400).json({ error: error.message });
  }
}

async function getActividadRecientePanel(req, res) {
  try {
    const limite = Math.min(parseInt(String(req.query.limite), 10) || 20, 50);
    const actividades = await publicacionesService.listActividadRecienteConUsuarios(limite);
    res.json(actividades);
  } catch (error) {
    console.error("Error al devolver actividad del panel:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function devolverTodaActividad(req, res) {
  console.log("=== 🔹 Solicitud GET /publicaciones/actividad-reciente 🔹 ===");
  console.log("Usuario que hace la petición (admin):", req.user);

  try {
    const actividades = await publicacionesService.devolverTodaActividad();
    res.json(actividades);
  } catch (error) {
    console.error("Error al devolver toda la actividad reciente:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllPublicaciones,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
  emailPublicacionController,
  devolverActividad,
  devolverTodaActividad,
  getActividadRecientePanel,
};