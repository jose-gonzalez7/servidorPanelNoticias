const prisma = require("../prisma/client");
const bcrypt = require('bcrypt');

async function listUsers() {
  return await prisma.usuario.findMany({
    select: {
      nombre: true,
      email: true,
      rol: true
    }
  });
}

async function createUser(data) {
  const { nombre, email, contraseña, rol } = data;

  // 1️⃣ Verificar si el email ya existe
  const existing = await prisma.usuario.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error(`El email ${email} ya está registrado`);
  }

  if (!ComprobarRol(rol)) {
    throw new Error(`El rol ${rol} no es válido. Debe ser 'editor' o 'profesor'`);
  }

  // 2️⃣ Generar hash de la contraseña
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(contraseña, saltRounds);

  // 3️⃣ Crear el usuario en la DB
  const user = await prisma.usuario.create({
    data: {
      nombre,
      email,
      rol,
      password_hash,
    },
    select: {
      nombre: true,
      email: true,
      rol: true,
      // password_hash: false -> se omite
    },
  });

  return user;
}

async function deleteUser(email) {
  // Verificar si el usuario existe
  const existing = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!existing) {
    throw new Error(`El usuario con email ${email} no existe`);
  }

  // Eliminar el usuario
  await prisma.usuario.delete({
    where: { email },
  });

  return { message: `Usuario con email ${email} eliminado` };
}

async function modificarUser(data) {
  const { email, nuevoNombre } = data; // recomiendo camelCase para JS

  if (!email || !nuevoNombre) {
    throw new Error('Email y nuevoNombre son obligatorios');
  }

  // 1️⃣ Verificar si el usuario existe
  const existing = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!existing) {
    throw new Error(`El usuario con email ${email} no existe`);
  }

  // 2️⃣ Actualizar solo el nombre
  const updatedUser = await prisma.usuario.update({
    where: { email },
    data: { nombre: nuevoNombre },
    select: { nombre: true, email: true, rol: true }, // no devuelve password_hash
  });

  return updatedUser;
}

function ComprobarRol(rol) {
  const rolesValidos = ['editor', 'profesor'];
  return rolesValidos.includes(rol);
}

module.exports = { listUsers, createUser, deleteUser, modificarUser };
