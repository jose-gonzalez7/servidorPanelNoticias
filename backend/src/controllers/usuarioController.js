const usuarioService = require("../services/usuarioService");

async function getAllUsers(req, res) {
  console.log('=== 🔹 Solicitud GET /usuarios 🔹 ===');
  console.log('Usuario que hace la petición:', req.user); // del middleware verifyToken

  try {
    const users = await usuarioService.listUsers();

    res.json({ success: true, users });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ success: false, message: "Error al obtener usuarios" });
  }
}

async function getAllUsersAdmin(req, res) {
  console.log('=== 🔹 Solicitud GET /usuarios/admin 🔹 ===');
  console.log('Usuario que hace la petición (admin):', req.user);

  try {
    const users = await usuarioService.listUsers();

    res.json({ success: true, users });
  } catch (err) {
    console.error('Error al obtener usuarios admin:', err);
    res.status(500).json({ success: false, message: "Error al obtener usuarios" });
  }
}

async function createUser(req, res) {
  console.log('=== 🔹 Solicitud POST /usuarios 🔹 ===');
  console.log('Usuario que hace la petición (admin):', req.user);
  console.log('Datos recibidos para crear usuario:', req.body);

  try {
    const nuevoUsuario = await usuarioService.createUser(req.body);
    
    res.status(201).json({ success: true, user: nuevoUsuario });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ success: false, message: "Error al crear usuario" });
  }
}

async function deleteUser(req, res) {
  console.log('=== 🔹 Solicitud DELETE /usuarios 🔹 ===');
  console.log('Usuario que hace la petición (admin):', req.user);
  console.log('Datos recibidos para eliminar usuario:', req.body);
  
  try {
    const result = await usuarioService.deleteUser(req.body.email);
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ success: false, message: "Error al eliminar usuario" });
  }
}

async function modificarUser(req, res) {
  console.log('=== 🔹 Solicitud PUT /usuarios 🔹 ===');
  console.log('Usuario que hace la petición (admin):', req.user);
  console.log('Datos recibidos para modificar usuario:', req.body);

  try{
    const result = await usuarioService.modificarUser(req.body);
    res.json({ success: true, message: "Usuario modificado correctamente" });
  } catch (err) {
    console.error('Error al modificar usuario:', err);
    res.status(500).json({ success: false, message: "Error al modificar usuario" });
  }
}

module.exports = { getAllUsers, getAllUsersAdmin, createUser, deleteUser, modificarUser };
