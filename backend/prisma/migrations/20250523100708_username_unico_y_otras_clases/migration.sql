/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Agricultor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Cooperativa" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cooperativa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administrador" (
    "id" SERIAL NOT NULL,
    "correo" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cooperativa_correo_key" ON "Cooperativa"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_correo_key" ON "Administrador"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_username_key" ON "Administrador"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Agricultor_username_key" ON "Agricultor"("username");
