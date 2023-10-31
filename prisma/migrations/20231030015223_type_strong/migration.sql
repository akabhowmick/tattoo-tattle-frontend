/*
  Warnings:

  - Made the column `type` on table `Artist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "statesLocation" TEXT NOT NULL,
    "tattooStyles" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Artist" ("email", "firstName", "id", "lastName", "password", "phoneNumber", "statesLocation", "tattooStyles", "type") SELECT "email", "firstName", "id", "lastName", "password", "phoneNumber", "statesLocation", "tattooStyles", "type" FROM "Artist";
DROP TABLE "Artist";
ALTER TABLE "new_Artist" RENAME TO "Artist";
CREATE UNIQUE INDEX "Artist_email_key" ON "Artist"("email");
CREATE TABLE "new_Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Client" ("email", "firstName", "id", "lastName", "password", "phoneNumber", "type") SELECT "email", "firstName", "id", "lastName", "password", "phoneNumber", "type" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
