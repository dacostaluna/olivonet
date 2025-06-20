-- CreateTable
CREATE TABLE "Cosecha" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "kg" DECIMAL(65,30) NOT NULL,
    "rendimiento" DECIMAL(65,30),
    "numOlivos" INTEGER NOT NULL,
    "temporada" INTEGER NOT NULL,
    "idAgricultor" INTEGER NOT NULL,
    "idPropiedad" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cosecha_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cosecha" ADD CONSTRAINT "Cosecha_idAgricultor_fkey" FOREIGN KEY ("idAgricultor") REFERENCES "Agricultor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cosecha" ADD CONSTRAINT "Cosecha_idPropiedad_fkey" FOREIGN KEY ("idPropiedad") REFERENCES "Propiedad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
