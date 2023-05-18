import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// READ
router.get('/', async function (req, res) {
  const songsOnPlaylists = await prisma.songOnPlaylist.findMany({
    include: {
      playlist: {
        include: {
          songs: true,
        },
      },
    },
  });
  return res.status(200).json(songsOnPlaylists);
});

router.get('/:playlist_id', async function (req, res) {
  const { playlist_id } = req.params;

  const songsOnPlaylists = await prisma.songOnPlaylist.findMany({
    where: {
      playlist_id: Number(playlist_id),
    },
    include: {
      playlist: {
        include: {
          songs: true,
        },
      },
    },
  });

  return res.status(200).json(songsOnPlaylists);
});

// CREATE
router.post('/', async function (req, res) {
  const { playlist_id, song_id } = req.body;

  if (!playlist_id || !song_id) {
    return res
      .status(400)
      .json({ error: 'playlist_id and song_id are required.' });
  }

  const foundPlaylist = await prisma.playlist.findUnique({
    where: {
      id: playlist_id,
    },
  });

  if (!foundPlaylist) {
    return res.status(404).json({ error: 'Playlist not found.' });
  }

  const foundSong = await prisma.song.findUnique({
    where: {
      id: song_id,
    },
  });

  if (!foundSong) {
    return res.status(404).json({ error: 'Song not found.' });
  }

  const songOnPlaylist = await prisma.songOnPlaylist.create({
    data: {
      playlist_id,
      song_id,
    },
    include: {
      playlist: {
        include: {
          songs: true,
        },
      },
    },
  });

  return res.status(201).json(songOnPlaylist);
});

// UPDATE
router.patch('/:id', async function (req, res) {
  const { id } = req.params;
  const { playlist_id, song_id } = req.body;

  if (!playlist_id || !song_id) {
    return res
      .status(400)
      .json({ error: 'playlist_id and song_id are required.' });
  }

  const foundSongOnPlaylist = await prisma.songOnPlaylist.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!foundSongOnPlaylist) {
    return res.status(404).json({ error: 'Song on playlist not found.' });
  }

  const foundPlaylist = await prisma.playlist.findUnique({
    where: {
      id: playlist_id,
    },
  });

  if (!foundPlaylist) {
    return res.status(404).json({ error: 'Playlist not found.' });
  }

  const foundSong = await prisma.song.findUnique({
    where: {
      id: song_id,
    },
  });

  if (!foundSong) {
    return res.status(404).json({ error: 'Song not found.' });
  }

  const songOnPlaylist = await prisma.songOnPlaylist.update({
    where: {
      id: Number(id),
    },
    data: {
      playlist_id,
      song_id,
    },
    include: {
      playlist: {
        include: {
          songs: true,
        },
      },
    },
  });

  return res.status(200).json(songOnPlaylist);
});

// DELETE
router.delete('/:id', async function (req, res) {
  const { id } = req.params;

  const foundSongOnPlaylist = await prisma.songOnPlaylist.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!foundSongOnPlaylist) {
    return res.status(404).json({ error: 'Song on playlist not found.' });
  }

  await prisma.songOnPlaylist.delete({
    where: {
      id: Number(id),
    },
  });

  return res.status(204).send();
});

export { router };
