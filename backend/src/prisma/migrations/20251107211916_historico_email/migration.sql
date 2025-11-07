-- CreateTable
CREATE TABLE "email_log" (
    "id_email" TEXT NOT NULL,
    "id_publicacion" VARCHAR(50) NOT NULL,
    "destinatarios" TEXT NOT NULL,
    "asunto" VARCHAR(150) NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(20) NOT NULL,
    "error_mensaje" TEXT,

    CONSTRAINT "email_log_pkey" PRIMARY KEY ("id_email")
);

-- AddForeignKey
ALTER TABLE "email_log" ADD CONSTRAINT "email_log_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE RESTRICT ON UPDATE CASCADE;
