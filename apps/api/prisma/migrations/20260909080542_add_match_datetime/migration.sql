-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "matchDateTime" TIMESTAMP(3),
ADD COLUMN     "tournamentId" TEXT;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;
