-- CreateTable
CREATE TABLE "Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "album_id" INTEGER,
    "author_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "cover_url" TEXT NOT NULL,
    "audio_url" TEXT NOT NULL,
    "duration_in_seconds" INTEGER NOT NULL,
    "authorId" INTEGER,
    CONSTRAINT "Song_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("album_id", "audio_url", "author_id", "cover_url", "duration_in_seconds", "id", "title") SELECT "album_id", "audio_url", "author_id", "cover_url", "duration_in_seconds", "id", "title" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
