/*
  Warnings:

  - You are about to drop the column `isfc_code` on the `Bank` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ifsc_code]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ifsc_code` to the `Bank` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Bank_isfc_code_key";

-- AlterTable
ALTER TABLE "Bank" DROP COLUMN "isfc_code",
ADD COLUMN     "ifsc_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bank_ifsc_code_key" ON "Bank"("ifsc_code");
