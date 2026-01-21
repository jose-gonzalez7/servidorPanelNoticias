-- CreateTable
CREATE TABLE "actividad_reciente" (
    "id_actividad" TEXT NOT NULL,
    "id_usuario" VARCHAR(50) NOT NULL,
    "actividad" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actividad_reciente_pkey" PRIMARY KEY ("id_actividad")
);
