-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "album_id" INTEGER,
    "author_id" INTEGER,
    "title" TEXT NOT NULL,
    "cover_url" TEXT NOT NULL,
    "audio_url" TEXT NOT NULL,
    "duration_in_seconds" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Song_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("album_id", "audio_url", "author_id", "cover_url", "duration_in_seconds", "id", "title") SELECT "album_id", "audio_url", "author_id", "cover_url", "duration_in_seconds", "id", "title" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gender_id" INTEGER NOT NULL,
    "region_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profile_url" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("birth_date", "email", "gender_id", "id", "password", "profile_url", "region_id", "username") SELECT "birth_date", "email", "gender_id", "id", "password", "profile_url", "region_id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Playlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cover_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Playlist" ("cover_url", "description", "id", "title", "user_id") SELECT "cover_url", "description", "id", "title", "user_id" FROM "Playlist";
DROP TABLE "Playlist";
ALTER TABLE "new_Playlist" RENAME TO "Playlist";
CREATE TABLE "new_SongOnPlaylist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playlist_id" INTEGER NOT NULL,
    "song_id" INTEGER NOT NULL,
    "added_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SongOnPlaylist_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SongOnPlaylist_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SongOnPlaylist" ("added_at", "id", "playlist_id", "song_id") SELECT "added_at", "id", "playlist_id", "song_id" FROM "SongOnPlaylist";
DROP TABLE "SongOnPlaylist";
ALTER TABLE "new_SongOnPlaylist" RENAME TO "SongOnPlaylist";
CREATE TABLE "new_Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Author" ("id", "name") SELECT "id", "name" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
