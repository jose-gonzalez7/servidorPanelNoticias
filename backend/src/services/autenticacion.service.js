const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

async function authenticateUser(email, password) {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error('Usuario o contraseña incorrectos');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Usuario o contraseña incorrectos');

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return {
    token, // 👈 lo seguimos devolviendo INTERNAMENTE
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }
  };
}

module.exports = { authenticateUser };
