const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/autenticacion.routes');
const usuarioRoutes = require('./routes/usuariosRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const publicacionesRoutes = require('./routes/publicacionesRoutes');
const meRoutes = require('./routes/me');

const app = express();

/**
 * 🔐 CORS: localhost + orígenes extra (p. ej. Vercel).
 * Railway: ALLOWED_ORIGINS=https://tu-app.vercel.app,https://otro.vercel.app
 * (sin espacios raros; la barra final es opcional — se normaliza)
 */
function normalizeOrigin(url) {
  if (!url || typeof url !== "string") return "";
  return url.trim().replace(/\/$/, "");
}

const defaultOrigins = ["http://localhost:3001", "http://localhost:3000"].map(
  normalizeOrigin
);
const extraOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => normalizeOrigin(s))
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

if (process.env.NODE_ENV !== "test") {
  console.log("[CORS] Orígenes permitidos:", allowedOrigins.join(" | "));
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const o = normalizeOrigin(origin);
      if (allowedOrigins.includes(o)) {
        return callback(null, true);
      }
      console.warn("[CORS] Origen rechazado:", origin, "| configurados:", allowedOrigins.length);
      return callback(new Error(`CORS bloqueado: ${origin}`));
    },
    credentials: true,
  })
);

/**
 * Middlewares base
 */
app.use(cookieParser());
app.use(express.json());

/**
 * Rutas
 */
app.use('/api', meRoutes);
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
