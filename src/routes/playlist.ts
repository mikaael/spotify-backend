import { Router } from 'express';
import { PrismaClient, User, Playlist } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

interface Filter{
  String: any
}

router.get('/', async function (req, res) {
  let filters = {"songs": false};
  let user: User | null = null;
  let playlists: Playlist[] | null = null;

  if(typeof req.query.songs === "string"){
    filters.songs = req.query.songs == "true" ? true : false; 
  }
  
  if(typeof req.query.userId === "string"){
    const id = parseInt(req.query.userId);
    user = await prisma.user.findUnique({where: {id}})
    if(user != null){
      playlists = await prisma.playlist.findMany({
        where: {
          userId: user.id
        },
        include: {
          ...filters
        }
      });
    }
  }else{
    playlists = await prisma.playlist.findMany({
      include: {
        ...filters
      }
    });
  }
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
