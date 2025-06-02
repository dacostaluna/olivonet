/*
  Warnings:

  - You are about to drop the column `tipo` on the `Propiedad` table. All the data in the column will be lost.
  - Added the required column `numOlivos` to the `Propiedad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propiedad" DROP COLUMN "tipo",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "edadOlivos" INTEGER,
ADD COLUMN     "numOlivos" INTEGER NOT NULL,
ADD COLUMN     "numOlivosRiego" INTEGER,
ADD COLUMN     "tieneRiego" BOOLEAN,
ADD COLUMN     "variedad" TEXT,
ALTER COLUMN "coordenadas" DROP NOT NULL,
ALTER COLUMN "descripcion" DROP NOT NULL;
