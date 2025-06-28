/*
  Warnings:

  - A unique constraint covering the columns `[nif]` on the table `Cooperativa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RolIA" AS ENUM ('AGRICULTOR', 'IA');

-- CreateTable
CREATE TABLE "MensajeIA" (
    "id" SERIAL NOT NULL,
    "contenido" TEXT NOT NULL,
    "rol" "RolIA" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agricultorId" INTEGER NOT NULL,

    CONSTRAINT "MensajeIA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cooperativa_nif_key" ON "Cooperativa"("nif");

-- AddForeignKey
ALTER TABLE "MensajeIA" ADD CONSTRAINT "MensajeIA_agricultorId_fkey" FOREIGN KEY ("agricultorId") REFERENCES "Agricultor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
