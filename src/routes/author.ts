import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async function (req, res) {
  const { ids } = req.body;

  const authors = await prisma.author.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  res.json(authors);
});

router.get('/:id', async function (req, res) {
  const { id } = req.params;

  const author = await prisma.author.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.json(author);
});

router.get('/songs', async function (req, res) {
  const authors = await prisma.author.findMany({
    include: {
      songs: true,
    },
  });
  res.json(authors);
});

// Searching for the authors' song by name
router.get('/song/:name', async function (req, res) {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: "The author's name is required in the url",
      },
    });
  }

  const authors = await prisma.author.findMany({
    where: {
      name: name,
    },
    include: {
      songs: true,
    },
  });
  res.json(authors);
});

router.post('/', async function (req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: 'Name is required',
      },
    });
  }

  const authorExists = await prisma.author.findMany({
    where: {
      name,
    },
  });

  if (authorExists.some((author) => author.name === name)) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: 'Author already exists',
      },
    });
  }

  const author = await prisma.author.create({
    data: {
      ...req.body,
    },
  });
  res.json(author);
});

router.patch('/:id', async function (req, res) {
  const id = parseInt(req.params.id);

  const author = await prisma.author.update({
    where: {
      id,
    },
    data: {
      ...req.body,
    },
  });
  res.json(author);
});

router.delete('/:id', async function (req, res) {
  const id = parseInt(req.params.id);

  await prisma.author.delete({
    where: {
      id,
    },
  });
  res.json({
    body: {
      status_code: 200,
      status: 'success',
      message: 'Author deleted successfully',
    },
  });
});

export { router };
