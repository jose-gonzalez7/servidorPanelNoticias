const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.token; // 👈 cookie httpOnly

  if (!token) {
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, rol }
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    const rolUsuario = req.user?.rol;

    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
    }

    next();
  };
}

module.exports = { verifyToken, requireRole };