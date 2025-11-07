const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

async function authenticateUser(email, password) {
  try {
    // Buscar usuario por email
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) throw new Error('Usuario o contraseña incorrectos');

    // Comparar contraseña
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error('Usuario o contraseña incorrectos');

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return {
      token,
      user: {
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    };
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = { authenticateUser };
