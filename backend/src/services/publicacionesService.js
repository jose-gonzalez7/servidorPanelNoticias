const e = require("express");
const prisma = require("../prisma/client");
const nodemailer = require("nodemailer");

// 🧾 Obtener todas las publicaciones
async function listPublicaciones() {
  try {
    const publicaciones = await prisma.publicaciones.findMany();
    return publicaciones;
  } catch (error) {
    throw new Error(error.message || "No se pudo obtener la lista de publicaciones");
  }
}

// 🆕 Crear una nueva publicación
async function createPublicacion(data) {
  try {
    // Convertir fechas si existen y vienen como string
    if (data.fecha_inicio) data.fecha_inicio = new Date(data.fecha_inicio);
    if (data.fecha_fin) data.fecha_fin = new Date(data.fecha_fin);

    const nuevaPublicacion = await prisma.publicaciones.create({ data });
    return nuevaPublicacion;
  } catch (error) {
    throw new Error(error.message || "No se pudo crear la publicación");
  }
}

// ✏️ Actualizar una publicación existente
async function updatePublicacion(id, data) {
  try {
    // ✅ Convertir fechas a Date si vienen como string
    if (data.fecha_inicio) data.fecha_inicio = new Date(data.fecha_inicio);
    if (data.fecha_fin) data.fecha_fin = new Date(data.fecha_fin);

    // ❌ Asegurarse de no intentar actualizar la clave primaria
    delete data.id_publicacion;

    const publicacionActualizada = await prisma.publicaciones.update({
      where: { id_publicacion: id }, // ID separado del body
      data, // Solo campos modificables
    });

    return publicacionActualizada;
  } catch (error) {
    // Manejo de error específico de Prisma
    if (error.code === 'P2025') {
      throw new Error(`No se encontró la publicación con id_publicacion=${id}`);
    }

    throw new Error(error.message || "No se pudo actualizar la publicación");
  }
}

// 🗑️ Eliminar una publicación
async function deletePublicacion(id) {
  try {
    await prisma.publicaciones.delete({
      where: { id_publicacion: id }, 
    });
  } catch (error) {
    throw new Error(error.message || "No se pudo eliminar la publicación");
  }
}

async function sendUrgentEmail(publicacion, destinatarios) {
  try {
    if (!publicacion) throw new Error("No se proporcionó la publicación");
    if (!destinatarios || !destinatarios.length) throw new Error("No se proporcionaron destinatarios");

    const transporter = nodemailer.createTransport({
      service: "gmail", // o cualquier servicio SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Panel Noticias" <${process.env.EMAIL_USER}>`,
      to: destinatarios.join(","), // array a string
      subject: `🔴 URGENTE: ${publicacion.titulo}`,
      html: `
        <h2>${publicacion.titulo}</h2>
        <p>${publicacion.cuerpo}</p>
        <p><strong>Vigencia:</strong> ${new Date(publicacion.fecha_inicio).toLocaleDateString()} - ${new Date(publicacion.fecha_fin).toLocaleDateString()}</p>
        <p>Prioridad: ${publicacion.prioridad}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email(s) enviado(s) correctamente");

    return { success: true, mensaje: "Emails enviados correctamente" };
  } catch (error) {
    console.error("❌ Error al enviar email:", error.message);
    return { success: false, mensaje: error.message };
  }
}

async function emailPublicacion(id_publicacion, destinatarios) {
  try {
    if (!id_publicacion) throw new Error("Falta id_publicacion");
    if (!destinatarios || !destinatarios.length) throw new Error("Debe indicar al menos un destinatario");

    const publicacion = await prisma.publicaciones.findUnique({
      where: { id_publicacion },
    });

    if (!publicacion) throw new Error("Publicación no encontrada");

    // Llamar a la función que envía el email y capturar resultado
    const resultadoEnvio = await sendUrgentEmail(publicacion, destinatarios);

    // Retornar resultado final
    return resultadoEnvio;
  } catch (error) {
    console.error("❌ Error en emailPublicacion:", error.message);
    return { success: false, mensaje: error.message };
  }
}

module.exports = {
  listPublicaciones,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
  emailPublicacion
};
