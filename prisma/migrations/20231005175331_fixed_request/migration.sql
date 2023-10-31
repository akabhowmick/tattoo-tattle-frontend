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
    CONSTRAINT "Request_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Request_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("approvalStatus", "artistId", "artistName", "clientId", "clientName", "id", "messageBody", "tattooOfInterestTitle") SELECT "approvalStatus", "artistId", "artistName", "clientId", "clientName", "id", "messageBody", "tattooOfInterestTitle" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
