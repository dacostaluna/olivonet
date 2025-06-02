/*
  Warnings:

  - Added the required column `coordenadas` to the `Propiedad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `Propiedad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direccion` to the `Propiedad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Propiedad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superficie` to the `Propiedad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propiedad" ADD COLUMN     "coordenadas" TEXT NOT NULL,
ADD COLUMN     "descripcion" TEXT NOT NULL,
ADD COLUMN     "direccion" TEXT NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "superficie" INTEGER NOT NULL;
