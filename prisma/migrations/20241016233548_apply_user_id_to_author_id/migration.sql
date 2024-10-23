-- This is an empty migration.

UPDATE "Quote"
SET "authorId" = (SELECT "id" FROM "User" WHERE "apiKey" = 'defaultApiKey')
WHERE "authorId" IS NULL;