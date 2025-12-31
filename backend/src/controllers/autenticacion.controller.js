const { authenticateUser } = require('../services/autenticacion.service');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { token, user } = await authenticateUser(email, password);

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,                    // ❗ false en localhost
      sameSite: isProd ? 'none' : 'lax', // ❗ lax en localhost
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = { login };
