const express = require("express");
const { verifyToken } = require("../middleware/auth");
const prisma = require("../prisma/client");

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error interno" });
  }
});

module.exports = router;
