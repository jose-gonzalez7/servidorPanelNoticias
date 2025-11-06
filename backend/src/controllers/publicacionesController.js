const publicacionesService = require('../services/publicacionesService');

async function getAllPublicaciones(req, res) {
  console.log('=== 🔹 Solicitud GET /publicaciones 🔹 ===');
  console.log('Usuario que hace la petición:', req.user); // del middleware verifyToken
    
    try {
        const publicaciones = await publicacionesService.listPublicaciones();   
        console.log('Publicaciones obtenidas:', publicaciones);
        res.json(publicaciones);
    } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        res.status(500).json({ error: 'Error al obtener publicaciones' });
    }
}

module.exports = {
  getAllPublicaciones,
};