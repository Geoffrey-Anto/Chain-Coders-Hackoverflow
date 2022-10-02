/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[isfc_code]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isfc_code` to the `Bank` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Bank_name_key";

-- AlterTable
ALTER TABLE "Bank" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "isfc_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bank_email_key" ON "Bank"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_isfc_code_key" ON "Bank"("isfc_code");
