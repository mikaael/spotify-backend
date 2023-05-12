import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async function (req, res) {
  const playlists = await prisma.playlist.findMany();
  res.json(playlists);
});

export { router };
