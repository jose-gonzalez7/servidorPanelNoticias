require('dotenv').config();
const prisma = require('../prisma/client'); // Ajusta la ruta según tu proyecto


async function main() {
  const publicaciones = [
    {
      id_publicacion: 'pub_001',
      titulo: 'Nuevo horario de clases',
      cuerpo: 'Se ha actualizado el horario de clases para el segundo trimestre. Revisa el panel interno para más detalles.',
      id_categoria: 'cat_01', // Noticias
      fecha_inicio: new Date('2025-11-01'),
      fecha_fin: new Date('2025-12-31'),
      prioridad: 'media',
      adjuntos: 'horario.pdf',
      etiquetas: 'clases, horario, noticias',
    },
    {
      id_publicacion: 'pub_002',
      titulo: 'Guardia de profesores - semana 45',
      cuerpo: 'Lista de guardias asignadas para la semana 45. Revisa tus turnos.',
      id_categoria: 'cat_02', // Guardias
      fecha_inicio: new Date('2025-11-04'),
      fecha_fin: new Date('2025-11-10'),
      prioridad: 'alta',
      adjuntos: 'guardias_semana45.pdf',
      etiquetas: 'guardias, profesores',
    },
    {
      id_publicacion: 'pub_003',
      titulo: 'Baja médica del profesor López',
      cuerpo: 'El profesor López estará de baja médica durante la semana 46. Se reorganizarán las clases correspondientes.',
      id_categoria: 'cat_03', // Bajas
      fecha_inicio: new Date('2025-11-05'),
      fecha_fin: new Date('2025-11-12'),
      prioridad: 'alta',
      adjuntos: 'parte_medico.pdf',
      etiquetas: 'bajas, profesores',
    },
    {
      id_publicacion: 'pub_004',
      titulo: 'Salida educativa al museo',
      cuerpo: 'Los alumnos de 2º ESO realizarán una salida al Museo de Ciencias el 20 de noviembre.',
      id_categoria: 'cat_04', // Salidas
      fecha_inicio: new Date('2025-11-10'),
      fecha_fin: new Date('2025-11-21'),
      prioridad: 'media',
      adjuntos: 'autorizacion_museo.pdf',
      etiquetas: 'salidas, alumnos, museo',
    },
    {
      id_publicacion: 'pub_005',
      titulo: 'Festival de Navidad 2025',
      cuerpo: 'El colegio organizará su tradicional festival navideño el 20 de diciembre. ¡Todos invitados!',
      id_categoria: 'cat_05', // Eventos
      fecha_inicio: new Date('2025-11-20'),
      fecha_fin: new Date('2025-12-20'),
      prioridad: 'baja',
      adjuntos: 'cartel_navidad.jpg',
      etiquetas: 'eventos, navidad',
    },
  ];

  for (const p of publicaciones) {
    const existing = await prisma.publicaciones.findUnique({
      where: { id_publicacion: p.id_publicacion },
    });

    if (existing) {
      console.log(`⚠️  La publicación ${p.titulo} (${p.id_publicacion}) ya existe.`);
      continue;
    }

    const pub = await prisma.publicaciones.create({ data: p });

    console.log(`✅ Publicación creada: ${pub.titulo} (${pub.id_publicacion})`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error al crear publicaciones:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
