const express = require('express');
const cors = require('cors');  // <-- Importar cors
const app = express();
const authRoutes = require('./routes/autenticacion.routes');
const usuarioRoutes = require('./routes/usuariosRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');


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

module.exports = app;
