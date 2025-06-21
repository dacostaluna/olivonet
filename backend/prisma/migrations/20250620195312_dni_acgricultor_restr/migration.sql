/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `Agricultor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Agricultor_dni_key" ON "Agricultor"("dni");
