const express = require('express');
const router = express.Router();
const { login } = require('../controllers/autenticacion.controller');

router.post('/login', login);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/", // 🔴 MUY IMPORTANTE
  });

  res.json({
    success: true,
    message: "Logout correcto",
  });
});

module.exports = router;
