/*
  Warnings:

  - The primary key for the `baja` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `categoria` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `guardia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notificacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pantallatv` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `publicaciones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `salidaalumno` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."baja" DROP CONSTRAINT "baja_id_publicacion_fkey";

-- DropForeignKey
ALTER TABLE "public"."guardia" DROP CONSTRAINT "guardia_id_publicacion_fkey";

-- DropForeignKey
ALTER TABLE "public"."notificacion" DROP CONSTRAINT "notificacion_id_publicacion_fkey";

-- DropForeignKey
ALTER TABLE "public"."publicaciones" DROP CONSTRAINT "publicaciones_id_categoria_fkey";

-- DropForeignKey
ALTER TABLE "public"."salidaalumno" DROP CONSTRAINT "salidaalumno_id_publicacion_fkey";

-- AlterTable
ALTER TABLE "baja" DROP CONSTRAINT "baja_pkey",
ALTER COLUMN "id_baja" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "id_publicacion" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "prioridad" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "baja_pkey" PRIMARY KEY ("id_baja");

-- AlterTable
ALTER TABLE "categoria" DROP CONSTRAINT "categoria_pkey",
ALTER COLUMN "id_categoria" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_categoria");

-- AlterTable
ALTER TABLE "guardia" DROP CONSTRAINT "guardia_pkey",
ALTER COLUMN "id_guardia" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "id_publicacion" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "aula_o_patio" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "observaciones" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "guardia_pkey" PRIMARY KEY ("id_guardia");

-- AlterTable
ALTER TABLE "notificacion" DROP CONSTRAINT "notificacion_pkey",
ALTER COLUMN "id_notificacion" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "asunto" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "id_publicacion" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id_notificacion");

-- AlterTable
ALTER TABLE "pantallatv" DROP CONSTRAINT "pantallatv_pkey",
ALTER COLUMN "id_pantalla" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "rotacion" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "pantallatv_pkey" PRIMARY KEY ("id_pantalla");

-- AlterTable
ALTER TABLE "publicaciones" DROP CONSTRAINT "publicaciones_pkey",
ALTER COLUMN "id_publicacion" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "titulo" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "id_categoria" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "adjuntos" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id_publicacion");

-- AlterTable
ALTER TABLE "salidaalumno" DROP CONSTRAINT "salidaalumno_pkey",
ALTER COLUMN "id_salida" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "id_publicacion" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "tipo" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "salidaalumno_pkey" PRIMARY KEY ("id_salida");

-- AlterTable
ALTER TABLE "usuario" ALTER COLUMN "rol" SET DATA TYPE VARCHAR(50);

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salidaalumno" ADD CONSTRAINT "salidaalumno_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baja" ADD CONSTRAINT "baja_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardia" ADD CONSTRAINT "guardia_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE RESTRICT ON UPDATE CASCADE;
