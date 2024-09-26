-- DropIndex
DROP INDEX "Quote_quote_key";

-- AlterTable
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_pkey" PRIMARY KEY ("quote");
