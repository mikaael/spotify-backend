import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response} from 'express';

const router = Router();
const prisma = new PrismaClient();

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  id: string[];
}

router.get('/', async function (req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,  res: Response) {
  let ids:number[] | undefined;
  if(req.query.id){
    ids = req.query.id.map(id => parseInt(id))
  }
  const songs = await prisma.song.findMany({
    where: {
      id: { in: ids}
    }
  });
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

router.patch('/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const song = await prisma.song.update({ 
    where: { id }, 
    data: {
      ...req.body
    }
  })
  res.json(song);
})

router.delete('/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const song = await prisma.song.delete({ 
    where: { id }
    
  })
  res.json(song);
})

export { router };
