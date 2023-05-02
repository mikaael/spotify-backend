const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router(`${__dirname}/../database/index.json`);

const middlewares = jsonServer.defaults();

const PORT = 3001;

server.use(middlewares);
server.use(router);

server.listen(PORT, () => {
    console.log(`🚀 JSON Server is running on port ${PORT}!`);
});
