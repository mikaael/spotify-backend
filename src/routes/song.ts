import { Router } from 'express';

import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async function (req, res) {
  const { ids } = req.body;

  let songs;
  if (ids && ids?.length > 0) {
    songs = await prisma.song.findMany({
      where: {
        id: { in: ids },
      },
    });
  } else {
    songs = await prisma.song.findMany();
  }

  res.json(songs);
});

router.get('/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const song = await prisma.song.findUnique({
    where: {
      id,
    },
  });
  res.json(song);
});

router.post('/', async function (req, res) {
  const song = await prisma.song.create({
    data: {
      ...req.body,
    },
  });
  res.json(song);
});

router.patch('/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const song = await prisma.song.update({
    where: { id },
    data: {
      ...req.body,
    },
  });
  res.json(song);
});

router.delete('/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const song = await prisma.song.delete({
    where: { id },
  });
  res.json(song);
});

export { router };
