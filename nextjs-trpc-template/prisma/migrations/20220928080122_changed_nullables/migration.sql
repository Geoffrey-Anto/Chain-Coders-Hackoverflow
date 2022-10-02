/*
  Warnings:

  - Made the column `userId` on table `Applications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bankId` on table `Applications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Applications" DROP CONSTRAINT "Applications_bankId_fkey";

-- DropForeignKey
ALTER TABLE "Applications" DROP CONSTRAINT "Applications_userId_fkey";

-- AlterTable
ALTER TABLE "Applications" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "bankId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
