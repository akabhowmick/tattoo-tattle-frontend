/*
  Warnings:

  - You are about to drop the column `artist` on the `Tattoo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tattoo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "dateCreated" TEXT NOT NULL,
    "artistName" TEXT,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "statesInput" TEXT NOT NULL,
    "tattooStyleInput" TEXT NOT NULL,
    "artistId" INTEGER NOT NULL,
    CONSTRAINT "Tattoo_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tattoo" ("artistId", "dateCreated", "description", "id", "image", "price", "statesInput", "tattooStyleInput", "title") SELECT "artistId", "dateCreated", "description", "id", "image", "price", "statesInput", "tattooStyleInput", "title" FROM "Tattoo";
DROP TABLE "Tattoo";
ALTER TABLE "new_Tattoo" RENAME TO "Tattoo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
