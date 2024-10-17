/*
  Warnings:

  - You are about to drop the column `userId` on the `Quote` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" RENAME COLUMN "userId" TO "authorId";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "username",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
