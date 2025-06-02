/*
  Warnings:

  - You are about to drop the column `color` on the `Propiedad` table. All the data in the column will be lost.
  - You are about to drop the column `edadOlivos` on the `Propiedad` table. All the data in the column will be lost.
  - You are about to drop the column `numOlivos` on the `Propiedad` table. All the data in the column will be lost.
  - You are about to drop the column `numOlivosRiego` on the `Propiedad` table. All the data in the column will be lost.
  - You are about to drop the column `tieneRiego` on the `Propiedad` table. All the data in the column will be lost.
  - You are about to drop the column `variedad` on the `Propiedad` table. All the data in the column will be lost.
  - Added the required column `tipo` to the `Propiedad` table without a default value. This is not possible if the table is not empty.
  - Made the column `coordenadas` on table `Propiedad` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descripcion` on table `Propiedad` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Propiedad" DROP COLUMN "color",
DROP COLUMN "edadOlivos",
DROP COLUMN "numOlivos",
DROP COLUMN "numOlivosRiego",
DROP COLUMN "tieneRiego",
DROP COLUMN "variedad",
ADD COLUMN     "tipo" TEXT NOT NULL,
ALTER COLUMN "coordenadas" SET NOT NULL,
ALTER COLUMN "descripcion" SET NOT NULL;
