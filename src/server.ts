import express from 'express';

import { router as authorRouter } from './routes/author';
import { router as playlistRouter } from './routes/playlist';
import { router as songRouter } from './routes/song';
import { router as songOnPlaylistRouter } from './routes/songOnPlaylist';
import { router as userRouter } from './routes/user';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/users', userRouter);
app.use('/playlists', playlistRouter);
app.use('/author', authorRouter)
app.use('/songs', songRouter);
app.use('/songsOnPlaylist', songOnPlaylistRouter);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}!`);
});
