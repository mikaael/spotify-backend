import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async function (req, res) {
  const users = await prisma.user.findMany();
  res.json(users);
});

export { router };
