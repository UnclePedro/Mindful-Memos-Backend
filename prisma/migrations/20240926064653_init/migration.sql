-- CreateTable
CREATE TABLE "Quote" (
    "quote" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_quote_key" ON "Quote"("quote");
