-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "ballType" TEXT NOT NULL DEFAULT 'leather',
ADD COLUMN     "ballsPerOver" INTEGER NOT NULL DEFAULT 6,
ADD COLUMN     "matchType" TEXT NOT NULL DEFAULT 'league',
ADD COLUMN     "tossDecision" TEXT,
ADD COLUMN     "tossWonBy" TEXT;
