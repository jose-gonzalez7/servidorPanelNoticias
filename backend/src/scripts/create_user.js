const bcrypt = require('bcrypt');
const prisma = require('../prisma/client'); // ajusta la ruta
require('dotenv').config();

async function main() {
  const saltRounds = 10;

  const users = [
    { nombre: 'administrador_1', email: 'admin@gmail.com', rol: 'administrador', password: '12345678' },
    { nombre: 'editor_1', email: 'editor@gmail.com', rol: 'editor', password: '12345678' },
    { nombre: 'profesor_1', email: 'profesor@gmail.com', rol: 'profesor', password: '12345678' },
  ];

  for (const u of users) {
    const existing = await prisma.usuario.findUnique({ where: { email: u.email } });

    if (existing) {
      console.log(`⚠️  El usuario ${u.nombre} (${u.email}) ya existe.`);
      continue;
    }

    const password_hash = await bcrypt.hash(u.password, saltRounds);

    const user = await prisma.usuario.create({
      data: {
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        password_hash,
      },
    });

    console.log(`✅ Usuario creado: ${user.nombre} (${user.email})`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error al crear usuarios:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
