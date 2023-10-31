/*
  Warnings:

  - Made the column `artistName` on table `Tattoo` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tattoo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "dateCreated" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "statesInput" TEXT NOT NULL,
    "tattooStyleInput" TEXT NOT NULL,
    "artistId" INTEGER NOT NULL,
    CONSTRAINT "Tattoo_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tattoo" ("artistId", "artistName", "dateCreated", "description", "id", "image", "price", "statesInput", "tattooStyleInput", "title") SELECT "artistId", "artistName", "dateCreated", "description", "id", "image", "price", "statesInput", "tattooStyleInput", "title" FROM "Tattoo";
DROP TABLE "Tattoo";
ALTER TABLE "new_Tattoo" RENAME TO "Tattoo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
