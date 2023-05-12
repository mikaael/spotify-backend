import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async function (req, res) {
  const playlists = await prisma.playlist.findMany();
  res.json(playlists);
});

router.get('/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const playlist = await prisma.playlist.findUnique({
    where: {
      id
    },
    include: {
      ...req.query
    },
  })
  res.json(playlist);
});

router.post('/', async function (req, res) {  
  const playlist = await prisma.playlist.create({
    data: {
      ...req.body
    },
  })
  res.json(playlist);
});

export { router };
