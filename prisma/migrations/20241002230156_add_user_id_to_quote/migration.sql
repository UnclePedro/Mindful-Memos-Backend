/*
  Warnings:

  - The primary key for the `Quote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_pkey",
DROP COLUMN "id",
ADD COLUMN     "quoteId" SERIAL NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'unknown',
ADD CONSTRAINT "Quote_pkey" PRIMARY KEY ("quoteId");
