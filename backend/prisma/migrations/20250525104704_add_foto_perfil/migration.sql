/*
  Warnings:

  - You are about to drop the column `foto` on the `Agricultor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agricultor" DROP COLUMN "foto",
ADD COLUMN     "fotoPerfil" TEXT;
