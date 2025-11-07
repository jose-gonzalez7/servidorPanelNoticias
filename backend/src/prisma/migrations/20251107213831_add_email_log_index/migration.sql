/*
  Warnings:

  - You are about to drop the `baja` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guardia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pantallatv` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salidaalumno` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."baja" DROP CONSTRAINT "baja_id_publicacion_fkey";

-- DropForeignKey
ALTER TABLE "public"."guardia" DROP CONSTRAINT "guardia_id_publicacion_fkey";

-- DropForeignKey
ALTER TABLE "public"."notificacion" DROP CONSTRAINT "notificacion_id_publicacion_fkey";

-- DropForeignKey
ALTER TABLE "public"."salidaalumno" DROP CONSTRAINT "salidaalumno_id_publicacion_fkey";

-- DropTable
DROP TABLE "public"."baja";

-- DropTable
DROP TABLE "public"."guardia";

-- DropTable
DROP TABLE "public"."notificacion";

-- DropTable
DROP TABLE "public"."pantallatv";

-- DropTable
DROP TABLE "public"."salidaalumno";

-- CreateIndex
CREATE INDEX "email_log_id_publicacion_fecha_envio_idx" ON "email_log"("id_publicacion", "fecha_envio");
