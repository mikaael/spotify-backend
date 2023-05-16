/*
  Warnings:

  - You are about to drop the column `authorId` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `SongOnPlaylist` table. All the data in the column will be lost.
  - You are about to drop the column `songId` on the `SongOnPlaylist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playlist_id` to the `SongOnPlaylist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `song_id` to the `SongOnPlaylist` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "album_id" INTEGER,
    "title" TEXT NOT NULL,
    "cover_url" TEXT NOT NULL,
    "audio_url" TEXT NOT NULL,
    "duration_in_seconds" INTEGER NOT NULL,
    "author_id" INTEGER,
    CONSTRAINT "Song_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("album_id", "audio_url", "cover_url", "duration_in_seconds", "id", "title") SELECT "album_id", "audio_url", "cover_url", "duration_in_seconds", "id", "title" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE TABLE "new_Playlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cover_url" TEXT,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Playlist" ("cover_url", "description", "id", "title") SELECT "cover_url", "description", "id", "title" FROM "Playlist";
DROP TABLE "Playlist";
ALTER TABLE "new_Playlist" RENAME TO "Playlist";
CREATE TABLE "new_SongOnPlaylist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "added_at" DATETIME NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "song_id" INTEGER NOT NULL,
    CONSTRAINT "SongOnPlaylist_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SongOnPlaylist_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SongOnPlaylist" ("added_at", "id") SELECT "added_at", "id" FROM "SongOnPlaylist";
DROP TABLE "SongOnPlaylist";
ALTER TABLE "new_SongOnPlaylist" RENAME TO "SongOnPlaylist";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");
