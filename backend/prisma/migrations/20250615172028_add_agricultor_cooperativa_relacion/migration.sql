-- AlterTable
ALTER TABLE "Agricultor" ADD COLUMN     "cooperativaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Agricultor" ADD CONSTRAINT "Agricultor_cooperativaId_fkey" FOREIGN KEY ("cooperativaId") REFERENCES "Cooperativa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
