/*
  Warnings:

  - Added the required column `private_key` to the `Bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_key` to the `Bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `private_key` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_key` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bank" ADD COLUMN     "private_key" TEXT NOT NULL,
ADD COLUMN     "public_key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "private_key" TEXT NOT NULL,
ADD COLUMN     "public_key" TEXT NOT NULL;
