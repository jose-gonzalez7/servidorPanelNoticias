const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/autenticacion.routes');
const usuarioRoutes = require('./routes/usuariosRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const publicacionesRoutes = require('./routes/publicacionesRoutes');

const app = express();

/**
 * 🔐 ORÍGENES PERMITIDOS (AHORA SOLO LOCALHOST)
 */
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (Postman, curl, SSR)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS bloqueado: ${origin}`));
  },
  credentials: true, // 🔴 OBLIGATORIO para cookies
}));

/**
 * Middlewares base
 */
app.use(cookieParser());
app.use(express.json());

/**
 * Rutas
 */
app.use('/api', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/publicaciones', publicacionesRoutes);

/**
 * Health
 */
app.get('/', (req, res) => {
  res.send('API Panel Noticias funcionando 🚀');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;
