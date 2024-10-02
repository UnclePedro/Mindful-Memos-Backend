/*
  Warnings:

  - The primary key for the `Quote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[quote]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Quote_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_quote_key" ON "Quote"("quote");
