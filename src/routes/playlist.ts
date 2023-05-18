import { Router } from 'express';
import { PrismaClient, User, Playlist } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async function (req, res) {
  let filters = { songs: false };
  let user: User | null = null;
  let playlists: Playlist[] | null = null;

  if (typeof req.query.songs === 'string') {
    filters.songs = req.query.songs == 'true';
  }

  if (typeof req.query.user_id === 'string') {
    const id = parseInt(req.query.user_id);
    user = await prisma.user.findUnique({ where: { id } });
    if (user != null) {
      playlists = await prisma.playlist.findMany({
        where: {
          user_id: user.id,
        },
        include: {
          ...filters,
        },
      });
    }
  } else {
    playlists = await prisma.playlist.findMany({
      include: {
        ...filters,
      },
    });
  }
  res.json(playlists);
});

router.get('/:id', async function (req, res) {
  const id = parseInt(req.params.id);

  let filters = { songs: false };

  if (typeof req.query.songs === 'string') {
    filters.songs = req.query.songs == 'true';
  }

  const playlist = await prisma.playlist.findUnique({
    where: {
      id,
    },
    include: {
      ...filters,
    },
  });
  res.json(playlist);
});

router.post('/', async function (req, res) {
  const { creator_id, title, description, cover_url } = req.body;
  const user_id = creator_id;

  const playlist = await prisma.playlist.create({
    data: {
      user_id,
      title,
      description,
      cover_url,
    },
  });
  res.json(playlist);
});

// Update playlist
router.patch('/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const playlist = await prisma.playlist.update({
    where: { id },
    data: { ...req.body },
  });
  res.json(playlist);
});

// Delete playlist
router.delete('/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  await prisma.playlist.delete({
    where: { id },
  });
  res.sendStatus(204);
});

export { router };
