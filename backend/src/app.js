const express = require('express');
const cors = require('cors');  // <-- Importar cors
const app = express();
const authRoutes = require('./routes/autenticacion.routes');
const usuarioRoutes = require('./routes/usuariosRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const publicacionesRoutes = require('./routes/publicacionesRoutes');


// Permitir solicitudes desde cualquier origen (para desarrollo)
app.use(cors());

// Para poder leer JSON en el body de las solicitudes
app.use(express.json());

// Rutas de autenticación
app.use('/api', authRoutes);

// Rutas de usuarios
app.use('/api/usuarios', usuarioRoutes);

//Ruta para las categorías
app.use('/api/categorias', categoriaRoutes);

//Ruta para las publicaciones
app.use('/api/publicaciones', publicacionesRoutes);

app.get("/", (req, res) => {
  res.send("API Panel Noticias funcionando 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

module.exports = app;
