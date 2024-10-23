/*
  Warnings:

  - You are about to drop the column `author` on the `Quote` table. All the data in the column will be lost.
  - The `authorId` column on the `Quote` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "author",
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
