/**
 * Inserta filas de ejemplo en actividad_reciente (datos manuales de prueba).
 *
 * Uso (desde la carpeta src):
 *   node scripts/seed_actividad_manual.js
 *   node scripts/seed_actividad_manual.js editor@gmail.com
 *
 * Requiere DATABASE_URL válido en .env apuntando a la BD donde quieras insertar.
 */

require("dotenv").config();
const prisma = require("../prisma/client");

const EJEMPLOS = [
  "Creó la publicación: Reunión de departamento (ID: pub-demo-1)",
  "Actualizó la publicación: Calendario de exámenes (ID: pub-demo-2)",
  "Eliminó la publicación: Borrador antiguo (ID: pub-demo-3)",
  "Envió alerta por email de la publicación: Aviso urgente",
];

async function main() {
  const emailArg = process.argv[2];

  let usuario;
  if (emailArg) {
    usuario = await prisma.usuario.findUnique({ where: { email: emailArg } });
    if (!usuario) {
      console.error(`❌ No existe usuario con email: ${emailArg}`);
      process.exit(1);
    }
  } else {
    usuario = await prisma.usuario.findFirst({ orderBy: { email: "asc" } });
    if (!usuario) {
      console.error(
        "❌ No hay usuarios en la tabla usuario. Crea uno primero (p. ej. npm run seed:user)."
      );
      process.exit(1);
    }
  }

  console.log(`Usando usuario: ${usuario.nombre} (${usuario.email}) id=${usuario.id_usuario}`);

  for (const texto of EJEMPLOS) {
    const row = await prisma.actividad_reciente.create({
      data: {
        id_usuario: usuario.id_usuario,
        actividad: texto,
      },
    });
    console.log(`✅ Insertada actividad ${row.id_actividad} — ${texto.slice(0, 50)}…`);
  }

  console.log(`\nListo: ${EJEMPLOS.length} filas en actividad_reciente.`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
