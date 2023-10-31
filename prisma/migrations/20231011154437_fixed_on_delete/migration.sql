-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientName" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "messageBody" TEXT NOT NULL,
    "approvalStatus" TEXT NOT NULL,
    "tattooOfInterestTitle" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,
    CONSTRAINT "Request_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Request_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("approvalStatus", "artistId", "artistName", "clientId", "clientName", "id", "messageBody", "tattooOfInterestTitle") SELECT "approvalStatus", "artistId", "artistName", "clientId", "clientName", "id", "messageBody", "tattooOfInterestTitle" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
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
    CONSTRAINT "Tattoo_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tattoo" ("artistId", "artistName", "dateCreated", "description", "id", "image", "price", "statesInput", "tattooStyleInput", "title") SELECT "artistId", "artistName", "dateCreated", "description", "id", "image", "price", "statesInput", "tattooStyleInput", "title" FROM "Tattoo";
DROP TABLE "Tattoo";
ALTER TABLE "new_Tattoo" RENAME TO "Tattoo";
CREATE TABLE "new_Favorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" INTEGER NOT NULL,
    "tattooId" INTEGER NOT NULL,
    CONSTRAINT "Favorite_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_tattooId_fkey" FOREIGN KEY ("tattooId") REFERENCES "Tattoo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Favorite" ("clientId", "id", "tattooId") SELECT "clientId", "id", "tattooId" FROM "Favorite";
DROP TABLE "Favorite";
ALTER TABLE "new_Favorite" RENAME TO "Favorite";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
