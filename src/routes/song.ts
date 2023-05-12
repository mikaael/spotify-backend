import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async function (req, res) {
  const songs = await prisma.song.findMany();
  res.json(songs);
});

router.get('/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const song = await prisma.song.findUnique({
    where: {
      id
    },
  })
  res.json(song);
});

router.post('/', async function (req, res) {  
  const song = await prisma.song.create({
    data: {
      ...req.body
    },
  })
  res.json(song);
});

export { router };
