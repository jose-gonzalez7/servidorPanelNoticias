require('dotenv').config();
const app = require('./app');
//const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

// ------------------------
// Test de conexión a Gmail
// ------------------------
/*(async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ Conexión exitosa con Gmail");
  } catch (error) {
    console.error("❌ Error en la conexión a Gmail:", error.message);
  }
})();*/

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

