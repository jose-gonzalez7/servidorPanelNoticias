const prisma = require("../prisma/client");
const nodemailer = require("nodemailer");

async function registrarActividad(usuarioId, descripcion) {
  try {
    if (!usuarioId) {
      console.warn("⚠️ No se proporcionó usuarioId para el registro de actividad.");
      return; 
    }
    await prisma.actividad_reciente.create({
      data: {
        id_usuario: usuarioId,
        actividad: descripcion,
      },
    });
    console.log(`📝 Actividad registrada: ${descripcion}`);
  } catch (error) {
    // Solo logueamos el error, no detenemos el flujo principal si falla el log
    console.error("❌ Error al registrar actividad reciente:", error.message);
  }
}

async function devolverActividad(usuarioId) {
  try {
    const actividades = await prisma.actividad_reciente.findMany({
      where: { id_usuario: usuarioId },
      orderBy: { fecha: "desc" },
    });
    return actividades;
  } catch (error) {
    throw new Error(error.message || "No se pudo obtener la actividad reciente");
  }
}

// 🔎 Obtener TODA la actividad reciente (para panel de administración)
async function devolverTodaActividad() {
  try {
    const actividades = await prisma.actividad_reciente.findMany({
      orderBy: { fecha: "desc" },
    });
    return actividades;
  } catch (error) {
    throw new Error(error.message || "No se pudo obtener la actividad reciente global");
  }
}

/** Actividad global para panel (editor/admin): últimas N entradas con nombre de usuario */
async function listActividadRecienteConUsuarios(limite = 20) {
  const take = Math.min(Math.max(Number(limite) || 20, 1), 50);
  const actividades = await prisma.actividad_reciente.findMany({
    orderBy: { fecha: "desc" },
    take,
  });
  const ids = [...new Set(actividades.map((a) => a.id_usuario).filter(Boolean))];
  const usuarios =
    ids.length > 0
      ? await prisma.usuario.findMany({
          where: { id_usuario: { in: ids } },
          select: { id_usuario: true, nombre: true },
        })
      : [];
  const nombres = Object.fromEntries(usuarios.map((u) => [u.id_usuario, u.nombre]));
  return actividades.map((a) => ({
    id_actividad: a.id_actividad,
    id_usuario: a.id_usuario,
    nombre_usuario: nombres[a.id_usuario] || "Usuario",
    actividad: a.actividad,
    fecha: a.fecha,
  }));
}

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
async function createPublicacion(data, usuarioId) {
  try {
    // Convertir fechas si existen y vienen como string
    if (data.fecha_inicio) data.fecha_inicio = new Date(data.fecha_inicio);
    if (data.fecha_fin) data.fecha_fin = new Date(data.fecha_fin);

    const nuevaPublicacion = await prisma.publicaciones.create({ data });
    await registrarActividad(
      usuarioId,
      `Creó la publicación: ${nuevaPublicacion.titulo} (ID: ${nuevaPublicacion.id_publicacion})`
    );
    return nuevaPublicacion;
  } catch (error) {
    throw new Error(error.message || "No se pudo crear la publicación");
  }
}

// ✏️ Actualizar una publicación existente
async function updatePublicacion(id, data, usuarioId) {
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

    await registrarActividad(
      usuarioId,
      `Actualizó la publicación: ${publicacionActualizada.titulo} (ID: ${id})`
    );

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
async function deletePublicacion(id, usuarioId) {
  try {
    const publicacion = await prisma.publicaciones.findUnique({
      where: { id_publicacion: id },
    });
    if (!publicacion) {
      throw new Error(`No se encontró la publicación con id_publicacion=${id}`);
    }
    await prisma.publicaciones.delete({
      where: { id_publicacion: id },
    });
    await registrarActividad(
      usuarioId,
      `Eliminó la publicación: ${publicacion.titulo} (ID: ${id})`
    );
  } catch (error) {
    throw new Error(error.message || "No se pudo eliminar la publicación");
  }
}

async function sendUrgentEmail(publicacion, destinatarios) {
  try {
    if (!publicacion) throw new Error("No se proporcionó la publicación");
    if (!destinatarios || !destinatarios.length) throw new Error("No se proporcionaron destinatarios");

    const transporter = nodemailer.createTransport({
      service: "gmail",
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

    let estado = "enviado";
    let errorMensaje = null;

    // Intentar enviar el email
    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email(s) enviado(s) correctamente");
    } catch (error) {
      estado = "error";
      errorMensaje = error.message;
      console.error("❌ Error al enviar email:", error.message);
    }

    // Guardar el log del email en la base de datos en un bloque try/catch separado
    try {
      await prisma.email_log.create({
        data: {
          id_publicacion: publicacion.id_publicacion,
          destinatarios: destinatarios.join(", "),
          asunto: mailOptions.subject,
          cuerpo: publicacion.cuerpo,
          estado,
          error_mensaje: errorMensaje,
        },
      });
      console.log("📩 Registro de email guardado correctamente");
    } catch (dbError) {
      console.error("❌ Error al guardar el log del email:", dbError.message);
    }

    return { success: estado === "enviado", mensaje: errorMensaje ?? "Emails enviados correctamente" };

  } catch (error) {
    console.error("❌ Error general en sendUrgentEmail:", error.message);
    return { success: false, mensaje: error.message };
  }
}

async function emailPublicacion(id_publicacion, destinatarios, usuarioId) {
  try {
    if (!id_publicacion) throw new Error("Falta id_publicacion");
    if (!destinatarios || !destinatarios.length) throw new Error("Debe indicar al menos un destinatario");

    const publicacion = await prisma.publicaciones.findUnique({
      where: { id_publicacion },
    });

    if (!publicacion) throw new Error("Publicación no encontrada");

    // Llamar a la función que envía el email y capturar resultado
    const resultadoEnvio = await sendUrgentEmail(publicacion, destinatarios);

    if (resultadoEnvio.success) {
      await registrarActividad(
        usuarioId,
        `Envió alerta por email de la publicación: ${publicacion.titulo}`
      );
    }

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
  emailPublicacion,
  devolverActividad,
  devolverTodaActividad,
  listActividadRecienteConUsuarios,
};
