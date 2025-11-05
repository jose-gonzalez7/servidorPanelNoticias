const prisma = require('../prisma/client'); // Ajusta la ruta según tu proyecto
require('dotenv').config();

async function main() {
  const categorias = [
    { id_categoria: 'cat_01', nombre: 'noticias' },
    { id_categoria: 'cat_02', nombre: 'guardias' },
    { id_categoria: 'cat_03', nombre: 'bajas' },
    { id_categoria: 'cat_04', nombre: 'salidas' },
    { id_categoria: 'cat_05', nombre: 'eventos' },
    { id_categoria: 'cat_06', nombre: 'urgentes' },
  ];

  for (const c of categorias) {
    const existing = await prisma.categoria.findUnique({
      where: { id_categoria: c.id_categoria },
    });

    if (existing) {
      console.log(`⚠️  La categoría ${c.nombre} (${c.id_categoria}) ya existe.`);
      continue;
    }

    const categoria = await prisma.categoria.create({
      data: c,
    });

    console.log(`✅ Categoría creada: ${categoria.nombre} (${categoria.id_categoria})`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error al crear categorías:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
