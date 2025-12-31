const express = require("express");
const { verifyToken, requireRole } = require("../Middleware/verificarToken");
const prisma = require("../prisma/client");

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  console.log("==== /api/me ====");
  console.log("Cookies recibidas:", req.cookies);
  console.log("User decodificado:", req.user);
  console.log("=================");

  const user = await prisma.usuario.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
    },
  });

  res.json(user);
});


module.exports = router;
