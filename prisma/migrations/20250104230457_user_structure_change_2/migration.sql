/*
  Warnings:

  - A unique constraint covering the columns `[authKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authKey" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_authKey_key" ON "User"("authKey");
