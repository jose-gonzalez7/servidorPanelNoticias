const { authenticateUser } = require('../services/autenticacion.service');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { token, user } = await authenticateUser(email, password);

    // 🔐 COOKIE HTTPONLY
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,          // 🔴 SIEMPRE TRUE EN RAILWAY
      sameSite: 'none',      // 🔴 CLAVE PARA DOMINIOS DIFERENTES
      maxAge: 2 * 60 * 60 * 1000,
    });

    // ❗️NO DEVOLVEMOS EL TOKEN
    res.json({
      success: true,
      user
    });

  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message
    });
  }
}

module.exports = { login };
